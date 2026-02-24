using CharacterMapRPG.BattleCore;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace CharacterMapRPG.BattleCore.Editor
{
    public static class BattleSceneGenerator
    {
        private const string ScenePath = "Assets/Scenes/BattleScene.unity";

        [MenuItem("Character Map RPG/Create Battle Scene")]
        public static void CreateBattleScene()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
            {
                EditorUtility.DisplayDialog(
                    "Character Map RPG",
                    "Deten Play Mode antes de generar la escena.",
                    "OK");
                return;
            }

            EnsureFolder("Assets/Scenes");

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "BattleScene";

            CreateCamera();
            CreateEventSystem();

            Canvas canvas = CreateCanvas();
            Font font = GetBuiltinFont();

            GameObject root = new GameObject("BattleUIRoot", typeof(RectTransform));
            root.transform.SetParent(canvas.transform, false);
            RectTransform rootRect = root.GetComponent<RectTransform>();
            rootRect.anchorMin = Vector2.zero;
            rootRect.anchorMax = Vector2.one;
            rootRect.offsetMin = Vector2.zero;
            rootRect.offsetMax = Vector2.zero;

            Image panel = CreatePanel(root.transform, "Panel", new Vector2(0.5f, 0.5f), new Vector2(900, 560), new Color(0.06f, 0.10f, 0.14f, 0.94f));
            RectTransform panelRect = panel.rectTransform;
            panelRect.anchoredPosition = Vector2.zero;

            Text title = CreateText(panel.transform, "TitleText", font, "Character Map RPG - Battle Core", 30, FontStyle.Bold, TextAnchor.UpperLeft);
            AnchorText(title.rectTransform, new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(20, -64), new Vector2(-20, -20));

            Text styleLabel = CreateText(panel.transform, "StyleText", font, "Estilo: Pack", 18, FontStyle.Bold, TextAnchor.UpperRight);
            styleLabel.color = new Color(0.76f, 0.90f, 1f, 1f);
            AnchorText(styleLabel.rectTransform, new Vector2(0.66f, 1f), new Vector2(1f, 1f), new Vector2(0, -54), new Vector2(-148, -20));

            Button styleButton = CreateButton(panel.transform, "StyleButton", font, "Cambiar", new Color(0.18f, 0.34f, 0.52f, 1f));
            AnchorButton(styleButton.GetComponent<RectTransform>(), new Vector2(0.84f, 1f), new Vector2(1f, 1f), new Vector2(0, -56), new Vector2(-20, -20));

            Image playerPortraitFrame = CreatePanel(panel.transform, "PlayerPortraitFrame", new Vector2(0f, 1f), new Vector2(0, 0), new Color(0.08f, 0.19f, 0.27f, 0.96f));
            AnchorText(playerPortraitFrame.rectTransform, new Vector2(0f, 1f), new Vector2(0.5f, 1f), new Vector2(20, -196), new Vector2(-12, -70));
            RawImage playerPortrait = CreatePortrait(playerPortraitFrame.transform, "PlayerPortrait", new Color(1f, 1f, 1f, 1f));

            Image enemyPortraitFrame = CreatePanel(panel.transform, "EnemyPortraitFrame", new Vector2(1f, 1f), new Vector2(0, 0), new Color(0.16f, 0.12f, 0.16f, 0.96f));
            AnchorText(enemyPortraitFrame.rectTransform, new Vector2(0.5f, 1f), new Vector2(1f, 1f), new Vector2(12, -196), new Vector2(-20, -70));
            RawImage enemyPortrait = CreatePortrait(enemyPortraitFrame.transform, "EnemyPortrait", new Color(1f, 1f, 1f, 1f));

            Text playerHp = CreateText(panel.transform, "PlayerHpText", font, "HP jugador: --", 24, FontStyle.Bold, TextAnchor.UpperLeft);
            AnchorText(playerHp.rectTransform, new Vector2(0f, 1f), new Vector2(0.5f, 1f), new Vector2(20, -252), new Vector2(-10, -212));
            Image playerTrack = CreatePanel(panel.transform, "PlayerHpTrack", new Vector2(0f, 1f), new Vector2(0, 20), new Color(0.05f, 0.10f, 0.14f, 0.92f));
            AnchorText(playerTrack.rectTransform, new Vector2(0f, 1f), new Vector2(0.5f, 1f), new Vector2(20, -280), new Vector2(-10, -262));
            Image playerFill = CreateFill(playerTrack.transform, "Fill", new Color(0.20f, 0.83f, 0.95f, 1f));

            Text enemyHp = CreateText(panel.transform, "EnemyHpText", font, "HP enemigo: --", 24, FontStyle.Bold, TextAnchor.UpperRight);
            AnchorText(enemyHp.rectTransform, new Vector2(0.5f, 1f), new Vector2(1f, 1f), new Vector2(10, -252), new Vector2(-20, -212));
            Image enemyTrack = CreatePanel(panel.transform, "EnemyHpTrack", new Vector2(1f, 1f), new Vector2(0, 20), new Color(0.05f, 0.10f, 0.14f, 0.92f));
            AnchorText(enemyTrack.rectTransform, new Vector2(0.5f, 1f), new Vector2(1f, 1f), new Vector2(10, -280), new Vector2(-20, -262));
            Image enemyFill = CreateFill(enemyTrack.transform, "Fill", new Color(0.95f, 0.38f, 0.50f, 1f));

            Text turnText = CreateText(panel.transform, "TurnText", font, "Turno: --", 22, FontStyle.Bold, TextAnchor.UpperLeft);
            AnchorText(turnText.rectTransform, new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(20, -320), new Vector2(-20, -282));

            Text previewText = CreateText(panel.transform, "PreviewText", font, "Ataque previsto: --", 22, FontStyle.Normal, TextAnchor.UpperLeft);
            previewText.color = new Color(1f, 0.92f, 0.64f, 1f);
            AnchorText(previewText.rectTransform, new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(20, -360), new Vector2(-20, -322));

            Text resultText = CreateText(panel.transform, "ResultText", font, "", 34, FontStyle.Bold, TextAnchor.MiddleCenter);
            resultText.color = new Color(1f, 0.84f, 0.36f, 1f);
            AnchorText(resultText.rectTransform, new Vector2(0f, 0.5f), new Vector2(1f, 0.5f), new Vector2(20, -56), new Vector2(-20, -8));

            Text combatLog = CreateText(panel.transform, "CombatLogText", font, "Listo para combate.", 20, FontStyle.Normal, TextAnchor.UpperLeft);
            combatLog.horizontalOverflow = HorizontalWrapMode.Wrap;
            combatLog.verticalOverflow = VerticalWrapMode.Overflow;
            AnchorText(combatLog.rectTransform, new Vector2(0f, 0.5f), new Vector2(1f, 0.5f), new Vector2(20, -214), new Vector2(-20, -76));

            Button attackButton = CreateButton(panel.transform, "AttackButton", font, "Atacar", new Color(0.66f, 0.22f, 0.26f, 1f));
            AnchorButton(attackButton.GetComponent<RectTransform>(), new Vector2(0.12f, 0f), new Vector2(0.37f, 0f), new Vector2(0, 24), new Vector2(0, 82));

            Button healButton = CreateButton(panel.transform, "HealButton", font, "Curar", new Color(0.12f, 0.52f, 0.45f, 1f));
            AnchorButton(healButton.GetComponent<RectTransform>(), new Vector2(0.39f, 0f), new Vector2(0.64f, 0f), new Vector2(0, 24), new Vector2(0, 82));

            Button escapeButton = CreateButton(panel.transform, "EscapeButton", font, "Escapar", new Color(0.64f, 0.46f, 0.16f, 1f));
            AnchorButton(escapeButton.GetComponent<RectTransform>(), new Vector2(0.66f, 0f), new Vector2(0.91f, 0f), new Vector2(0, 24), new Vector2(0, 82));

            GameObject driverGo = new GameObject("BattleDriver", typeof(BattleDriver));
            BattleDriver driver = driverGo.GetComponent<BattleDriver>();
            driver.BindUi(playerHp, enemyHp, turnText, previewText, resultText, combatLog, attackButton, healButton, escapeButton);
            driver.BindHpBars(playerFill, enemyFill);
            driver.BindPortraits(playerPortrait, enemyPortrait, playerPortraitFrame.rectTransform, enemyPortraitFrame.rectTransform);
            driver.BindStyleUi(styleButton, styleLabel);
            if (Object.FindFirstObjectByType<GameSession>() == null)
            {
                new GameObject("GameSession", typeof(GameSession));
            }
            if (Object.FindFirstObjectByType<AudioManager>() == null)
            {
                new GameObject("AudioManager", typeof(AudioManager));
            }

            EditorSceneManager.SaveScene(scene, ScenePath);
            EnsureSceneInBuildSettings(ScenePath);
            EditorSceneManager.OpenScene(ScenePath);
            EditorUtility.DisplayDialog("Character Map RPG", "BattleScene creada y conectada en Assets/Scenes/BattleScene.unity", "OK");
        }

        [MenuItem("Character Map RPG/Create Battle Scene", true)]
        private static bool ValidateCreateBattleScene()
        {
            return !EditorApplication.isPlayingOrWillChangePlaymode;
        }

        private static void EnsureFolder(string path)
        {
            string[] parts = path.Split('/');
            string current = parts[0];
            for (int i = 1; i < parts.Length; i += 1)
            {
                string next = $"{current}/{parts[i]}";
                if (!AssetDatabase.IsValidFolder(next))
                {
                    AssetDatabase.CreateFolder(current, parts[i]);
                }
                current = next;
            }
        }

        private static void CreateCamera()
        {
            GameObject cam = new GameObject("Main Camera", typeof(Camera), typeof(AudioListener));
            cam.tag = "MainCamera";
            Camera camera = cam.GetComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.03f, 0.06f, 0.10f, 1f);
            cam.transform.position = new Vector3(0f, 0f, -10f);
        }

        private static void CreateEventSystem()
        {
            GameObject go = new GameObject("EventSystem", typeof(EventSystem));
            bool addedInputSystemModule = TryAddInputSystemUIModule(go);
            if (!addedInputSystemModule)
            {
                Object.DestroyImmediate(go);
                throw new System.InvalidOperationException(
                    "No se pudo crear InputSystemUIInputModule. Verifica que el package Unity Input System este instalado.");
            }
        }

        private static Canvas CreateCanvas()
        {
            GameObject go = new GameObject("Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            Canvas canvas = go.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            CanvasScaler scaler = go.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1280, 720);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;
            return canvas;
        }

        private static Image CreatePanel(Transform parent, string name, Vector2 anchor, Vector2 size, Color color)
        {
            GameObject go = new GameObject(name, typeof(RectTransform), typeof(Image));
            go.transform.SetParent(parent, false);
            Image image = go.GetComponent<Image>();
            image.color = color;
            RectTransform rt = go.GetComponent<RectTransform>();
            rt.anchorMin = anchor;
            rt.anchorMax = anchor;
            rt.sizeDelta = size;
            return image;
        }

        private static Text CreateText(Transform parent, string name, Font font, string value, int size, FontStyle style, TextAnchor anchor)
        {
            GameObject go = new GameObject(name, typeof(RectTransform), typeof(Text));
            go.transform.SetParent(parent, false);
            Text text = go.GetComponent<Text>();
            text.font = font;
            text.text = value;
            text.fontSize = size;
            text.fontStyle = style;
            text.alignment = anchor;
            text.color = new Color(0.92f, 0.96f, 1f, 1f);
            return text;
        }

        private static Button CreateButton(Transform parent, string name, Font font, string label, Color color)
        {
            GameObject go = new GameObject(name, typeof(RectTransform), typeof(Image), typeof(Button));
            go.transform.SetParent(parent, false);
            Image image = go.GetComponent<Image>();
            image.color = color;
            Button button = go.GetComponent<Button>();

            GameObject textGo = new GameObject("Text", typeof(RectTransform), typeof(Text));
            textGo.transform.SetParent(go.transform, false);
            Text text = textGo.GetComponent<Text>();
            text.font = font;
            text.text = label;
            text.fontSize = 24;
            text.fontStyle = FontStyle.Bold;
            text.alignment = TextAnchor.MiddleCenter;
            text.color = Color.white;

            RectTransform textRect = textGo.GetComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.offsetMin = Vector2.zero;
            textRect.offsetMax = Vector2.zero;
            return button;
        }

        private static Image CreateFill(Transform parent, string name, Color color)
        {
            GameObject go = new GameObject(name, typeof(RectTransform), typeof(Image));
            go.transform.SetParent(parent, false);
            Image fill = go.GetComponent<Image>();
            fill.color = color;
            RectTransform rt = fill.rectTransform;
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
            return fill;
        }

        private static RawImage CreatePortrait(Transform parent, string name, Color tint)
        {
            GameObject go = new GameObject(name, typeof(RectTransform), typeof(RawImage));
            go.transform.SetParent(parent, false);
            RawImage raw = go.GetComponent<RawImage>();
            raw.color = tint;
            RectTransform rt = raw.rectTransform;
            rt.anchorMin = new Vector2(0f, 0f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.offsetMin = new Vector2(10f, 10f);
            rt.offsetMax = new Vector2(-10f, -10f);
            return raw;
        }

        private static void AnchorText(RectTransform rt, Vector2 min, Vector2 max, Vector2 offsetMin, Vector2 offsetMax)
        {
            rt.anchorMin = min;
            rt.anchorMax = max;
            rt.offsetMin = offsetMin;
            rt.offsetMax = offsetMax;
        }

        private static void AnchorButton(RectTransform rt, Vector2 min, Vector2 max, Vector2 offsetMin, Vector2 offsetMax)
        {
            rt.anchorMin = min;
            rt.anchorMax = max;
            rt.offsetMin = offsetMin;
            rt.offsetMax = offsetMax;
        }

        private static Font GetBuiltinFont()
        {
            Font font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            if (font != null) return font;
            return Resources.GetBuiltinResource<Font>("Arial.ttf");
        }

        private static bool TryAddInputSystemUIModule(GameObject go)
        {
            const string typeName = "UnityEngine.InputSystem.UI.InputSystemUIInputModule, Unity.InputSystem";
            System.Type inputSystemType = System.Type.GetType(typeName);
            if (inputSystemType == null) return false;
            go.AddComponent(inputSystemType);
            return true;
        }

        private static void EnsureSceneInBuildSettings(string scenePath)
        {
            var scenes = new System.Collections.Generic.List<EditorBuildSettingsScene>(EditorBuildSettings.scenes);
            foreach (var scene in scenes)
            {
                if (scene.path == scenePath)
                {
                    if (!scene.enabled)
                    {
                        scene.enabled = true;
                        EditorBuildSettings.scenes = scenes.ToArray();
                    }
                    return;
                }
            }

            scenes.Add(new EditorBuildSettingsScene(scenePath, true));
            EditorBuildSettings.scenes = scenes.ToArray();
        }
    }
}
