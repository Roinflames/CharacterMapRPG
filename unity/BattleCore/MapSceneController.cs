using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace CharacterMapRPG.BattleCore
{
    public sealed class MapSceneController : MonoBehaviour
    {
        [SerializeField] private Text statusText;
        [SerializeField] private Text detailText;
        [SerializeField] private RawImage mapImage;
        [SerializeField] private RectTransform mapViewport;
        [SerializeField] private List<EncounterDefinition> encounterDefinitions = new List<EncounterDefinition>();

        private GameSession _session;
        private float _nextMoveAt;
        private Texture2D _mapTexture;

        private static readonly Color32 WallColor = new Color32(30, 45, 57, 255);
        private static readonly Color32 FloorAColor = new Color32(45, 85, 106, 255);
        private static readonly Color32 FloorBColor = new Color32(57, 100, 124, 255);
        private static readonly Color32 GoalColor = new Color32(255, 209, 102, 255);
        private static readonly Color32 PlayerColor = new Color32(239, 71, 111, 255);
        private static readonly Color32 MilestonePendingColor = new Color32(255, 90, 95, 255);
        private static readonly Color32 MilestoneDoneColor = new Color32(84, 211, 138, 255);

        private void Start()
        {
            _session = GameSession.Instance;
            if (encounterDefinitions == null || encounterDefinitions.Count == 0)
            {
                encounterDefinitions = EncounterCatalog.CreateDefaults();
            }

            EnsureMapView();
            RefreshStatus();
            RefreshMap();
        }

        private void Update()
        {
            if (_session == null) return;
            if (Time.unscaledTime < _nextMoveAt) return;

            int dx;
            int dy;
            GetMoveInput(out dx, out dy);
            if (dx == 0 && dy == 0) return;

            _nextMoveAt = Time.unscaledTime + 0.12f;
            if (_session.TryMovePlayer(dx, dy, out string message, out string encounterId))
            {
                if (!string.IsNullOrWhiteSpace(message)) detailText.text = message;
                RefreshStatus();
                RefreshMap();

                if (!string.IsNullOrWhiteSpace(encounterId))
                {
                    _session.StartEncounter(encounterId);
                }
            }
        }

        public void StartEncounterById(string encounterId)
        {
            if (_session == null)
            {
                detailText.text = "Sesion no disponible.";
                return;
            }

            _session.StartEncounter(encounterId);
        }

        private static void GetMoveInput(out int dx, out int dy)
        {
            dx = 0;
            dy = 0;
#if ENABLE_INPUT_SYSTEM
            Keyboard k = Keyboard.current;
            if (k == null) return;
            if (k.wKey.wasPressedThisFrame || k.upArrowKey.wasPressedThisFrame) dy = -1;
            else if (k.sKey.wasPressedThisFrame || k.downArrowKey.wasPressedThisFrame) dy = 1;
            else if (k.aKey.wasPressedThisFrame || k.leftArrowKey.wasPressedThisFrame) dx = -1;
            else if (k.dKey.wasPressedThisFrame || k.rightArrowKey.wasPressedThisFrame) dx = 1;
#else
            if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.UpArrow)) dy = -1;
            else if (Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.DownArrow)) dy = 1;
            else if (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.LeftArrow)) dx = -1;
            else if (Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.RightArrow)) dx = 1;
#endif
        }

        private void RefreshStatus()
        {
            if (_session == null)
            {
                statusText.text = "Sesion no inicializada.";
                detailText.text = "No se pudo cargar progreso.";
                return;
            }

            int completed = 0;
            foreach (EncounterDefinition encounter in encounterDefinitions)
            {
                if (_session.IsEncounterCompleted(encounter.Id)) completed += 1;
            }

            RouteDefinition route = _session.GetCurrentRoute();
            string routeLabel = route != null ? route.Label : _session.CurrentRouteId;
            statusText.text = $"Ruta: {routeLabel} | Nivel: {_session.Progression.Level} | EXP: {_session.Progression.Exp}/{_session.Progression.NextExp} | Completados: {completed}/{encounterDefinitions.Count}";
            if (string.IsNullOrWhiteSpace(detailText.text))
            {
                detailText.text = "Muevete con WASD o flechas para activar encuentros.";
            }
        }

        private void RefreshMap()
        {
            if (!_session) return;
            EnsureMapView();
            if (!mapImage || !mapViewport) return;

            RouteDefinition route = _session.GetCurrentRoute();
            if (route == null)
            {
                detailText.text = "Sin mapa.";
                return;
            }

            int tileFromWidth = Mathf.FloorToInt((mapViewport.rect.width - 12f) / route.Width);
            int tileFromHeight = Mathf.FloorToInt((mapViewport.rect.height - 12f) / route.Height);
            int tile = Mathf.Clamp(Mathf.Min(tileFromWidth, tileFromHeight), 16, 64);
            int width = Mathf.Max(1, route.Width * tile);
            int height = Mathf.Max(1, route.Height * tile);
            EnsureMapTexture(width, height);
            ClearTexture(_mapTexture, new Color32(11, 24, 36, 255));

            for (int y = 0; y < route.Height; y += 1)
            {
                for (int x = 0; x < route.Width; x += 1)
                {
                    int tileValue = route.Map[y][x];
                    Color32 color;
                    if (tileValue == 1) color = WallColor;
                    else if (tileValue == 2) color = GoalColor;
                    else color = ((x + y) % 2 == 0) ? FloorAColor : FloorBColor;
                    FillCell(_mapTexture, x, y, tile, color);
                }
            }

            foreach (RouteMilestone milestone in route.Milestones)
            {
                bool done = _session.IsEncounterCompleted(milestone.EncounterId);
                DrawDiamond(_mapTexture, milestone.Position.x, milestone.Position.y, tile, done ? MilestoneDoneColor : MilestonePendingColor);
            }

            Vector2Int player = _session.GetPlayerPosition();
            DrawDisc(_mapTexture, player.x, player.y, tile, PlayerColor);

            _mapTexture.Apply(false);
            mapImage.texture = _mapTexture;
            RectTransform mapRt = mapImage.rectTransform;
            mapRt.sizeDelta = new Vector2(width, height);
            mapRt.anchoredPosition = new Vector2(
                Mathf.Round((mapViewport.rect.width - width) * 0.5f),
                -Mathf.Round((mapViewport.rect.height - height) * 0.5f));
        }

        private void EnsureMapView()
        {
            if (mapImage && mapViewport) return;
            GameObject canvasGo = GameObject.Find("Canvas");
            if (!canvasGo) return;
            Transform panel = canvasGo.transform.Find("MapUIRoot/Panel");
            if (!panel) return;

            Transform existing = panel.Find("MapViewport");
            if (existing)
            {
                mapViewport = existing.GetComponent<RectTransform>();
                mapImage = existing.GetComponentInChildren<RawImage>();
                return;
            }

            GameObject viewportGo = new GameObject("MapViewport", typeof(RectTransform), typeof(Image), typeof(Mask));
            viewportGo.transform.SetParent(panel, false);
            mapViewport = viewportGo.GetComponent<RectTransform>();
            mapViewport.anchorMin = new Vector2(0f, 0f);
            mapViewport.anchorMax = new Vector2(1f, 1f);
            mapViewport.offsetMin = new Vector2(20f, 20f);
            mapViewport.offsetMax = new Vector2(-20f, -170f);

            Image viewportImage = viewportGo.GetComponent<Image>();
            viewportImage.color = new Color32(18, 39, 55, 255);

            GameObject imageGo = new GameObject("MapImage", typeof(RectTransform), typeof(RawImage));
            imageGo.transform.SetParent(viewportGo.transform, false);
            RectTransform mapRect = imageGo.GetComponent<RectTransform>();
            mapRect.anchorMin = new Vector2(0f, 1f);
            mapRect.anchorMax = new Vector2(0f, 1f);
            mapRect.pivot = new Vector2(0f, 1f);
            mapRect.anchoredPosition = new Vector2(0f, 0f);
            mapRect.sizeDelta = new Vector2(320f, 200f);

            mapImage = imageGo.GetComponent<RawImage>();
        }

        private void EnsureMapTexture(int width, int height)
        {
            if (_mapTexture != null && _mapTexture.width == width && _mapTexture.height == height) return;
            if (_mapTexture != null) Destroy(_mapTexture);
            _mapTexture = new Texture2D(width, height, TextureFormat.RGBA32, false)
            {
                filterMode = FilterMode.Point,
                wrapMode = TextureWrapMode.Clamp
            };
        }

        private static void ClearTexture(Texture2D tex, Color32 color)
        {
            Color32[] pixels = tex.GetPixels32();
            for (int i = 0; i < pixels.Length; i += 1) pixels[i] = color;
            tex.SetPixels32(pixels);
        }

        private static void FillCell(Texture2D tex, int cellX, int cellY, int tileSize, Color32 color)
        {
            int px0 = cellX * tileSize;
            int py0 = tex.height - (cellY + 1) * tileSize;
            for (int y = 0; y < tileSize; y += 1)
            {
                for (int x = 0; x < tileSize; x += 1)
                {
                    tex.SetPixel(px0 + x, py0 + y, color);
                }
            }
        }

        private static void DrawDiamond(Texture2D tex, int cellX, int cellY, int tileSize, Color32 color)
        {
            int cx = cellX * tileSize + tileSize / 2;
            int cy = tex.height - (cellY * tileSize + tileSize / 2);
            int r = Mathf.Max(3, tileSize / 3);
            for (int dy = -r; dy <= r; dy += 1)
            {
                int span = r - Mathf.Abs(dy);
                for (int dx = -span; dx <= span; dx += 1)
                {
                    int x = cx + dx;
                    int y = cy + dy;
                    if (x >= 0 && y >= 0 && x < tex.width && y < tex.height) tex.SetPixel(x, y, color);
                }
            }
        }

        private static void DrawDisc(Texture2D tex, int cellX, int cellY, int tileSize, Color32 color)
        {
            int cx = cellX * tileSize + tileSize / 2;
            int cy = tex.height - (cellY * tileSize + tileSize / 2);
            int r = Mathf.Max(4, tileSize / 3);
            int rr = r * r;
            for (int dy = -r; dy <= r; dy += 1)
            {
                for (int dx = -r; dx <= r; dx += 1)
                {
                    if (dx * dx + dy * dy > rr) continue;
                    int x = cx + dx;
                    int y = cy + dy;
                    if (x >= 0 && y >= 0 && x < tex.width && y < tex.height) tex.SetPixel(x, y, color);
                }
            }
        }

        private void OnDestroy()
        {
            if (_mapTexture != null)
            {
                Destroy(_mapTexture);
                _mapTexture = null;
            }
        }
    }
}
