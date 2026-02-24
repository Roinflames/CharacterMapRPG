using CharacterMapRPG.BattleCore;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace CharacterMapRPG.BattleCore.Editor
{
    public static class MapSceneGenerator
    {
        private const string ScenePath = "Assets/Scenes/MapScene.unity";

        [MenuItem("Character Map RPG/Create Map Scene")]
        public static void CreateMapScene()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
            {
                EditorUtility.DisplayDialog("Character Map RPG", "Deten Play Mode antes de generar la escena.", "OK");
                return;
            }

            EnsureFolder("Assets/Scenes");

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "MapScene";

            CreateCamera();
            CreateEventSystem();
            Canvas canvas = CreateCanvas();
            Font font = GetBuiltinFont();

            var root = new GameObject("MapUIRoot", typeof(RectTransform));
            root.transform.SetParent(canvas.transform, false);
            var rootRect = root.GetComponent<RectTransform>();
            rootRect.anchorMin = Vector2.zero;
            rootRect.anchorMax = Vector2.one;
            rootRect.offsetMin = Vector2.zero;
            rootRect.offsetMax = Vector2.zero;

            Image panel = CreatePanel(root.transform, "Panel", new Vector2(0.5f, 0.5f), new Vector2(980, 600), new Color(0.05f, 0.12f, 0.16f, 0.95f));

            Text title = CreateText(panel.transform, "TitleText", font, "Character Map RPG - Map Scene", 30, FontStyle.Bold, TextAnchor.UpperLeft);
            Anchor(title.rectTransform, new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(20, -64), new Vector2(-20, -20));

            Text status = CreateText(panel.transform, "StatusText", font, "Nivel: --", 22, FontStyle.Bold, TextAnchor.UpperLeft);
            Anchor(status.rectTransform, new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(20, -116), new Vector2(-20, -76));

            Text detail = CreateText(panel.transform, "DetailText", font, "Muevete con WASD o flechas para activar encuentros.", 20, FontStyle.Normal, TextAnchor.UpperLeft);
            detail.color = new Color(0.84f, 0.94f, 1f, 1f);
            Anchor(detail.rectTransform, new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(20, -156), new Vector2(-20, -122));

            // Visual map viewport (texture rendered by MapSceneController).
            GameObject mapViewportGo = new GameObject("MapViewport", typeof(RectTransform), typeof(Image), typeof(Mask));
            mapViewportGo.transform.SetParent(panel.transform, false);
            RectTransform mapViewport = mapViewportGo.GetComponent<RectTransform>();
            mapViewport.anchorMin = new Vector2(0f, 0f);
            mapViewport.anchorMax = new Vector2(1f, 1f);
            mapViewport.offsetMin = new Vector2(20f, 20f);
            mapViewport.offsetMax = new Vector2(-20f, -170f);
            mapViewportGo.GetComponent<Image>().color = new Color(0.10f, 0.22f, 0.30f, 1f);

            GameObject mapImageGo = new GameObject("MapImage", typeof(RectTransform), typeof(RawImage));
            mapImageGo.transform.SetParent(mapViewportGo.transform, false);
            RectTransform mapImageRt = mapImageGo.GetComponent<RectTransform>();
            mapImageRt.anchorMin = new Vector2(0f, 1f);
            mapImageRt.anchorMax = new Vector2(0f, 1f);
            mapImageRt.pivot = new Vector2(0f, 1f);
            mapImageRt.anchoredPosition = Vector2.zero;
            mapImageRt.sizeDelta = new Vector2(320f, 200f);
            RawImage mapImage = mapImageGo.GetComponent<RawImage>();
            mapImage.color = Color.white;

            GameObject controllerGo = new GameObject("MapSceneController", typeof(MapSceneController));
            MapSceneController controller = controllerGo.GetComponent<MapSceneController>();

            var so = new SerializedObject(controller);
            so.FindProperty("statusText").objectReferenceValue = status;
            so.FindProperty("detailText").objectReferenceValue = detail;
            so.FindProperty("mapImage").objectReferenceValue = mapImage;
            so.FindProperty("mapViewport").objectReferenceValue = mapViewport;
            so.ApplyModifiedPropertiesWithoutUndo();

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
            EditorUtility.DisplayDialog("Character Map RPG", "MapScene creada en Assets/Scenes/MapScene.unity", "OK");
        }

        [MenuItem("Character Map RPG/Create Map Scene", true)]
        private static bool ValidateCreateMapScene()
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
            var cam = new GameObject("Main Camera", typeof(Camera), typeof(AudioListener));
            cam.tag = "MainCamera";
            var camera = cam.GetComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.03f, 0.07f, 0.12f, 1f);
            cam.transform.position = new Vector3(0, 0, -10);
        }

        private static void CreateEventSystem()
        {
            var go = new GameObject("EventSystem", typeof(EventSystem));
            const string typeName = "UnityEngine.InputSystem.UI.InputSystemUIInputModule, Unity.InputSystem";
            System.Type t = System.Type.GetType(typeName);
            if (t != null) go.AddComponent(t);
        }

        private static Canvas CreateCanvas()
        {
            GameObject go = new GameObject("Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            Canvas canvas = go.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = go.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1280, 720);
            scaler.matchWidthOrHeight = 0.5f;
            return canvas;
        }

        private static Image CreatePanel(Transform parent, string name, Vector2 anchor, Vector2 size, Color color)
        {
            GameObject go = new GameObject(name, typeof(RectTransform), typeof(Image));
            go.transform.SetParent(parent, false);
            var image = go.GetComponent<Image>();
            image.color = color;
            var rt = go.GetComponent<RectTransform>();
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

        private static void Anchor(RectTransform rt, Vector2 min, Vector2 max, Vector2 offsetMin, Vector2 offsetMax)
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
