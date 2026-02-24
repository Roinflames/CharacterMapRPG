using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace CharacterMapRPG.BattleCore
{
    public sealed class BattleDriver : MonoBehaviour
    {
        [Header("Setup")]
        [SerializeField] private string encounterId = "r1m1";
        [SerializeField] private bool isBossEncounter = false;
        [SerializeField] private List<EncounterDefinition> encounterDefinitions = new List<EncounterDefinition>();
        [SerializeField] private FighterStats playerStats = new FighterStats
        {
            Id = "player",
            MaxHp = 36,
            CurrentHp = 36,
            Atk = 9,
            Def = 4,
            CritThreshold = 20,
            HealPower = 8,
            EscapeChance = 0.6f
        };
        [SerializeField] private FighterStats enemyStats = new FighterStats
        {
            Id = "lobo_sombrio",
            MaxHp = 26,
            CurrentHp = 26,
            Atk = 8,
            Def = 3,
            CritThreshold = 19,
            HealPower = 4,
            EscapeChance = 0f
        };

        [Header("UI")]
        [SerializeField] private Text playerHpText;
        [SerializeField] private Text enemyHpText;
        [SerializeField] private Text turnText;
        [SerializeField] private Text previewText;
        [SerializeField] private Text resultText;
        [SerializeField] private Text combatLogText;
        [SerializeField] private Image playerHpFillImage;
        [SerializeField] private Image enemyHpFillImage;
        [SerializeField] private RawImage playerPortraitImage;
        [SerializeField] private RawImage enemyPortraitImage;
        [SerializeField] private RectTransform playerPortraitRoot;
        [SerializeField] private RectTransform enemyPortraitRoot;
        [SerializeField] private Button attackButton;
        [SerializeField] private Button healButton;
        [SerializeField] private Button escapeButton;
        [SerializeField] private Button styleButton;
        [SerializeField] private Text styleText;
        [SerializeField] private PortraitVisualStyle portraitStyle = PortraitVisualStyle.AssetPack;
        [SerializeField] private bool allowDemoEncounterWithoutPending = false;

        private BattleEngine _engine;
        private BattleProgression _progression;
        private GameSession _session;
        private bool _busy;
        private EncounterDefinition _activeEncounter;
        private Coroutine _playerHpAnim;
        private Coroutine _enemyHpAnim;
        private Coroutine _impactTextAnim;
        private Coroutine _playerBreathAnim;
        private Coroutine _enemyBreathAnim;
        private Texture2D _playerPortraitTexture;
        private Texture2D _enemyPortraitTexture;

        private void Awake()
        {
            _engine = new BattleEngine();
            _session = GameSession.Instance;
            _progression = _session != null ? _session.Progression : new BattleProgression();
            _progression.ConfigureLevel3Boss("lvl3_boss_portal", true);
            EnsureEncounterCatalog();
        }

        private void Start()
        {
            WireButtons();
            StartEncounter();
        }

        public void StartEncounter()
        {
            WireButtons();
            resultText.text = "";
            combatLogText.text = "";

            if (_session != null && !string.IsNullOrWhiteSpace(_session.PendingEncounterId))
            {
                encounterId = _session.PendingEncounterId;
                _session.ClearPendingEncounter();
            }
            else if (!allowDemoEncounterWithoutPending)
            {
                combatLogText.text = "Sin encuentro activo. Volviendo al mapa...";
                SetButtonsInteractable(false);
                StartCoroutine(ReturnToMapAfterDelay(0.15f));
                return;
            }

            _activeEncounter = ResolveEncounter(encounterId);
            encounterId = _activeEncounter.Id;
            isBossEncounter = _activeEncounter.IsBoss;
            enemyStats = CloneStats(_activeEncounter.EnemyStats);
            enemyStats.CurrentHp = enemyStats.MaxHp;
            if (_session != null)
            {
                playerStats = CloneStats(_session.PlayerStats);
                playerStats.CurrentHp = Mathf.Clamp(playerStats.CurrentHp, 1, playerStats.MaxHp);
            }
            else
            {
                playerStats.CurrentHp = Mathf.Clamp(playerStats.CurrentHp, 1, playerStats.MaxHp);
            }

            _engine.Initialize(playerStats, enemyStats);
            RefreshPortraits();
            RefreshUi();
            TryRefreshPreview();
            SetHpFillImmediate(playerHpFillImage, 1f);
            SetHpFillImmediate(enemyHpFillImage, 1f);
            SetButtonsInteractable(true);
            UpdateStyleLabel();
            combatLogText.text = $"Encuentro: {_activeEncounter.DisplayName}";
        }

        public void OnAttackPressed()
        {
            if (_busy) return;
            AudioManager.Instance?.PlayUiClick();
            StartCoroutine(RunPlayerAction(ActionType.Attack));
        }

        public void OnHealPressed()
        {
            if (_busy) return;
            AudioManager.Instance?.PlayUiClick();
            StartCoroutine(RunPlayerAction(ActionType.Heal));
        }

        public void OnEscapePressed()
        {
            if (_busy) return;
            AudioManager.Instance?.PlayUiClick();

            bool canEscape = _progression.CanEscapeEncounter(encounterId, isBossEncounter);
            if (!canEscape)
            {
                combatLogText.text = "No puedes escapar de este combate.";
                return;
            }

            StartCoroutine(RunPlayerAction(ActionType.Escape));
        }

        public void OnStylePressed()
        {
            portraitStyle = (PortraitVisualStyle)(((int)portraitStyle + 1) % 4);
            UpdateStyleLabel();
            RefreshPortraits();
            AudioManager.Instance?.PlayUiClick();
        }

        private IEnumerator RunPlayerAction(ActionType action)
        {
            if (_engine.IsFinished) yield break;
            if (_engine.CurrentTurn != TeamSide.Player) yield break;

            _busy = true;
            SetButtonsInteractable(false);

            ActionResolution playerResolution = _engine.ExecutePlayerAction(action);
            ApplyResolution(playerResolution);
            RefreshUi();

            if (_engine.IsFinished)
            {
                HandleBattleEnd();
                _busy = false;
                yield break;
            }

            yield return new WaitForSeconds(0.35f);

            ActionResolution enemyResolution = _engine.ExecuteEnemyTurn();
            ApplyResolution(enemyResolution);
            RefreshUi();

            if (_engine.IsFinished)
            {
                HandleBattleEnd();
                _busy = false;
                yield break;
            }

            SetButtonsInteractable(true);
            TryRefreshPreview();
            _busy = false;
        }

        private void HandleBattleEnd()
        {
            SetButtonsInteractable(false);
            TryRefreshPreview();

            if (_engine.Winner == TeamSide.Player)
            {
                resultText.text = "Victoria";
                resultText.color = new Color(1f, 0.86f, 0.38f, 1f);
                combatLogText.text = "Enemigo derrotado.";
                AudioManager.Instance?.PlayEnemyKo();
                _session?.ResolveBattleResult(_activeEncounter, true, false);
                StartCoroutine(FadeOutPortrait(enemyPortraitImage, 0.48f));
            }
            else
            {
                bool escaped = _engine.LastResolution != null && _engine.LastResolution.Type == ActionType.Escape && _engine.LastResolution.Escaped;
                if (escaped)
                {
                    resultText.text = "Escape";
                    resultText.color = new Color(0.95f, 0.85f, 0.45f, 1f);
                    combatLogText.text = "Escapaste del combate.";
                    _session?.ResolveBattleResult(_activeEncounter, false, true);
                }
                else
                {
                    resultText.text = "Derrota";
                    resultText.color = new Color(1f, 0.48f, 0.48f, 1f);
                    combatLogText.text = "Has sido derrotado.";
                    AudioManager.Instance?.PlayPlayerKo();
                    _session?.ResolveBattleResult(_activeEncounter, false, false);
                    StartCoroutine(FadeOutPortrait(playerPortraitImage, 0.48f));
                }
            }

            StartCoroutine(ReturnToMapAfterDelay());
        }

        private void RefreshUi()
        {
            BattleSnapshot snapshot = _engine.Snapshot();
            playerHpText.text = $"HP jugador: {snapshot.PlayerHp}/{playerStats.MaxHp}";
            enemyHpText.text = $"HP enemigo: {snapshot.EnemyHp}/{enemyStats.MaxHp}";
            turnText.text = snapshot.IsFinished
                ? "Turno: Finalizado"
                : snapshot.CurrentTurn == TeamSide.Player ? "Turno: Jugador" : "Turno: Enemigo";

            float playerTarget = playerStats.MaxHp > 0 ? Mathf.Clamp01((float)snapshot.PlayerHp / playerStats.MaxHp) : 0f;
            float enemyTarget = enemyStats.MaxHp > 0 ? Mathf.Clamp01((float)snapshot.EnemyHp / enemyStats.MaxHp) : 0f;
            AnimateHpFill(playerHpFillImage, playerTarget, ref _playerHpAnim);
            AnimateHpFill(enemyHpFillImage, enemyTarget, ref _enemyHpAnim);
            _session?.SyncPlayerCurrentHp(snapshot.PlayerHp);
        }

        private void TryRefreshPreview()
        {
            if (_engine.IsFinished || _engine.CurrentTurn != TeamSide.Player)
            {
                previewText.text = "Ataque previsto: --";
                return;
            }

            ActionResolution preview = _engine.PreviewPlayerAttack();
            previewText.text = $"Ataque previsto: {preview.PredictedDamage} dano (d20:{preview.D20Roll})";
        }

        private void ApplyResolution(ActionResolution resolution)
        {
            combatLogText.text = resolution.LogLine;
            switch (resolution.Type)
            {
                case ActionType.Attack:
                    if (resolution.IsCritical) AudioManager.Instance?.PlayCrit();
                    else AudioManager.Instance?.PlayHit();
                    ShowImpactText(resolution.IsCritical ? $"-{resolution.AppliedDamage} CRIT" : $"-{resolution.AppliedDamage}", new Color(1f, 0.55f, 0.55f, 1f), 0.55f);
                    break;
                case ActionType.Heal:
                    AudioManager.Instance?.PlayHeal();
                    ShowImpactText($"+{resolution.HealAmount}", new Color(0.44f, 0.95f, 0.68f, 1f), 0.55f);
                    break;
                case ActionType.Escape:
                    AudioManager.Instance?.PlayEscape();
                    ShowImpactText(resolution.Escaped ? "Escape!" : "Sin escape", new Color(0.9f, 0.82f, 0.5f, 1f), 0.45f);
                    break;
            }
        }

        private void SetButtonsInteractable(bool value)
        {
            if (attackButton) attackButton.interactable = value;
            if (healButton) healButton.interactable = value;
            if (styleButton) styleButton.interactable = value;

            bool escapeAllowedByEncounter = _activeEncounter == null || _activeEncounter.EscapeAllowed;
            bool canEscape = value && escapeAllowedByEncounter && _progression.CanEscapeEncounter(encounterId, isBossEncounter);
            if (escapeButton) escapeButton.interactable = canEscape;
        }

        public void BindUi(
            Text playerHp,
            Text enemyHp,
            Text turn,
            Text preview,
            Text result,
            Text combatLog,
            Button attack,
            Button heal,
            Button escapeBtn)
        {
            playerHpText = playerHp;
            enemyHpText = enemyHp;
            turnText = turn;
            previewText = preview;
            resultText = result;
            combatLogText = combatLog;
            attackButton = attack;
            healButton = heal;
            escapeButton = escapeBtn;
            WireButtons();
        }

        public void BindHpBars(Image playerFill, Image enemyFill)
        {
            playerHpFillImage = playerFill;
            enemyHpFillImage = enemyFill;
        }

        public void BindPortraits(RawImage playerPortrait, RawImage enemyPortrait, RectTransform playerRoot, RectTransform enemyRoot)
        {
            playerPortraitImage = playerPortrait;
            enemyPortraitImage = enemyPortrait;
            playerPortraitRoot = playerRoot;
            enemyPortraitRoot = enemyRoot;
        }

        public void BindStyleUi(Button styleToggle, Text styleLabel)
        {
            styleButton = styleToggle;
            styleText = styleLabel;
            UpdateStyleLabel();
            WireButtons();
        }

        private void WireButtons()
        {
            if (attackButton)
            {
                attackButton.onClick.RemoveListener(OnAttackPressed);
                attackButton.onClick.AddListener(OnAttackPressed);
            }
            if (healButton)
            {
                healButton.onClick.RemoveListener(OnHealPressed);
                healButton.onClick.AddListener(OnHealPressed);
            }
            if (escapeButton)
            {
                escapeButton.onClick.RemoveListener(OnEscapePressed);
                escapeButton.onClick.AddListener(OnEscapePressed);
            }
            if (styleButton)
            {
                styleButton.onClick.RemoveListener(OnStylePressed);
                styleButton.onClick.AddListener(OnStylePressed);
            }
        }

        private void ShowImpactText(string text, Color color, float duration)
        {
            if (!resultText || _engine.IsFinished) return;
            if (_impactTextAnim != null) StopCoroutine(_impactTextAnim);
            _impactTextAnim = StartCoroutine(PlayImpactText(text, color, duration));
        }

        private IEnumerator PlayImpactText(string text, Color color, float duration)
        {
            resultText.text = text;
            resultText.color = color;
            yield return new WaitForSeconds(duration);
            if (_engine != null && !_engine.IsFinished)
            {
                resultText.text = "";
            }
        }

        private static void SetHpFillImmediate(Image image, float value)
        {
            if (!image || !image.rectTransform) return;
            image.rectTransform.anchorMax = new Vector2(Mathf.Clamp01(value), 1f);
        }

        private void AnimateHpFill(Image image, float target, ref Coroutine handle)
        {
            if (!image || !image.rectTransform) return;
            if (handle != null) StopCoroutine(handle);
            handle = StartCoroutine(AnimateHpFillRoutine(image, Mathf.Clamp01(target)));
        }

        private static IEnumerator AnimateHpFillRoutine(Image image, float target)
        {
            RectTransform rt = image.rectTransform;
            float current = rt.anchorMax.x;
            float t = 0f;
            const float duration = 0.34f;
            while (t < duration)
            {
                t += Time.deltaTime;
                float lerp = Mathf.SmoothStep(current, target, Mathf.Clamp01(t / duration));
                rt.anchorMax = new Vector2(lerp, 1f);
                yield return null;
            }
            rt.anchorMax = new Vector2(target, 1f);
        }

        private void EnsureEncounterCatalog()
        {
            if (encounterDefinitions != null && encounterDefinitions.Count > 0) return;
            encounterDefinitions = EncounterCatalog.CreateDefaults();
        }

        private EncounterDefinition ResolveEncounter(string id)
        {
            EnsureEncounterCatalog();
            if (encounterDefinitions == null || encounterDefinitions.Count == 0)
            {
                return new EncounterDefinition();
            }

            foreach (EncounterDefinition encounter in encounterDefinitions)
            {
                if (encounter != null && encounter.Id == id)
                {
                    return encounter;
                }
            }

            return encounterDefinitions[0];
        }

        private static FighterStats CloneStats(FighterStats source)
        {
            return new FighterStats
            {
                Id = source.Id,
                MaxHp = source.MaxHp,
                CurrentHp = source.CurrentHp,
                Atk = source.Atk,
                Def = source.Def,
                CritThreshold = source.CritThreshold,
                HealPower = source.HealPower,
                EscapeChance = source.EscapeChance
            };
        }

        private static IEnumerator ReturnToMapAfterDelay(float delay = 1.2f)
        {
            yield return new WaitForSeconds(delay);
            SceneFlow.LoadMapScene();
        }

        private void RefreshPortraits()
        {
            if (playerPortraitImage)
            {
                Texture2D loaded = PortraitAssetLibrary.TryLoad(playerStats.Id, true, portraitStyle);
                if (loaded != null)
                {
                    if (_playerPortraitTexture) Destroy(_playerPortraitTexture);
                    _playerPortraitTexture = null;
                    playerPortraitImage.texture = loaded;
                }
                else
                {
                    if (_playerPortraitTexture) Destroy(_playerPortraitTexture);
                    _playerPortraitTexture = PortraitPainter.CreatePortrait(playerStats.Id, true, portraitStyle);
                    playerPortraitImage.texture = _playerPortraitTexture;
                }
                playerPortraitImage.color = Color.white;
            }

            if (enemyPortraitImage)
            {
                Texture2D loaded = PortraitAssetLibrary.TryLoad(enemyStats.Id, false, portraitStyle);
                if (loaded != null)
                {
                    if (_enemyPortraitTexture) Destroy(_enemyPortraitTexture);
                    _enemyPortraitTexture = null;
                    enemyPortraitImage.texture = loaded;
                }
                else
                {
                    if (_enemyPortraitTexture) Destroy(_enemyPortraitTexture);
                    _enemyPortraitTexture = PortraitPainter.CreatePortrait(enemyStats.Id, false, portraitStyle);
                    enemyPortraitImage.texture = _enemyPortraitTexture;
                }
                enemyPortraitImage.color = Color.white;
            }

            if (playerPortraitRoot != null)
            {
                if (_playerBreathAnim != null) StopCoroutine(_playerBreathAnim);
                _playerBreathAnim = StartCoroutine(Breathing(playerPortraitRoot, 1f, 0.014f, 0.16f));
            }

            if (enemyPortraitRoot != null)
            {
                if (_enemyBreathAnim != null) StopCoroutine(_enemyBreathAnim);
                _enemyBreathAnim = StartCoroutine(Breathing(enemyPortraitRoot, 1f, 0.018f, 0.25f));
            }
        }

        private static IEnumerator Breathing(RectTransform target, float baseScale, float amplitude, float phase)
        {
            while (target != null)
            {
                float t = Time.unscaledTime * 2f + phase;
                float scale = baseScale + Mathf.Sin(t) * amplitude;
                target.localScale = new Vector3(scale, scale, 1f);
                yield return null;
            }
        }

        private static IEnumerator FadeOutPortrait(RawImage image, float duration)
        {
            if (!image) yield break;
            Color start = image.color;
            float t = 0f;
            while (t < duration)
            {
                t += Time.deltaTime;
                float alpha = Mathf.Lerp(start.a, 0f, Mathf.Clamp01(t / duration));
                image.color = new Color(start.r, start.g, start.b, alpha);
                yield return null;
            }
            image.color = new Color(start.r, start.g, start.b, 0f);
        }

        private void OnDestroy()
        {
            if (_playerPortraitTexture) Destroy(_playerPortraitTexture);
            if (_enemyPortraitTexture) Destroy(_enemyPortraitTexture);
        }

        private void UpdateStyleLabel()
        {
            if (!styleText) return;
            switch (portraitStyle)
            {
                case PortraitVisualStyle.Classic:
                    styleText.text = "Estilo: Clasico";
                    break;
                case PortraitVisualStyle.DarkIllustrated:
                    styleText.text = "Estilo: Oscuro";
                    break;
                case PortraitVisualStyle.PixelRetro:
                    styleText.text = "Estilo: Pixel";
                    break;
                case PortraitVisualStyle.AssetPack:
                    styleText.text = "Estilo: Pack";
                    break;
            }
        }
    }
}
