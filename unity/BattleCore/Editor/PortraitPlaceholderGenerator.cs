using System.IO;
using UnityEditor;
using UnityEngine;

namespace CharacterMapRPG.BattleCore.Editor
{
    public static class PortraitPlaceholderGenerator
    {
        private const int Width = 480;
        private const int Height = 220;

        [MenuItem("Character Map RPG/Generate Portrait Placeholders")]
        public static void Generate()
        {
            string root = "Assets/Resources/Portraits/pack";
            EnsureDir(root);

            Write("default_player", new Color32(76, 132, 198, 255));
            Write("default_enemy", new Color32(182, 88, 88, 255));
            Write("wolf", new Color32(152, 160, 172, 255));
            Write("bandit", new Color32(214, 118, 74, 255));
            Write("stone_guardian", new Color32(160, 164, 170, 255));
            Write("witch", new Color32(182, 140, 218, 255));
            Write("dragon", new Color32(236, 170, 82, 255));
            Write("archer", new Color32(152, 206, 110, 255));
            Write("knight", new Color32(186, 200, 214, 255));
            Write("portal_lord", new Color32(124, 178, 246, 255));

            // Specific fighter ids used by encounters.
            Write("lobo_sombrio", new Color32(152, 160, 172, 255));
            Write("bandido_valle", new Color32(214, 118, 74, 255));
            Write("guardian_piedra", new Color32(160, 164, 170, 255));
            Write("bruja_pantano", new Color32(182, 140, 218, 255));
            Write("dragon_menor", new Color32(236, 170, 82, 255));
            Write("arquero_eclipse", new Color32(152, 206, 110, 255));
            Write("caballero_perdido", new Color32(186, 200, 214, 255));
            Write("capitan_portal", new Color32(124, 178, 246, 255));
            Write("senor_portal", new Color32(124, 178, 246, 255));

            AssetDatabase.Refresh();
            EditorUtility.DisplayDialog("Character Map RPG", "Placeholders generados en Assets/Resources/Portraits/pack", "OK");
        }

        private static void Write(string id, Color32 main)
        {
            Texture2D tex = new Texture2D(Width, Height, TextureFormat.RGBA32, false)
            {
                filterMode = FilterMode.Point,
                wrapMode = TextureWrapMode.Clamp
            };

            Color32 outline = new Color32(44, 48, 58, 255);
            Color32 shade = new Color32(
                (byte)Mathf.Max(0, main.r - 42),
                (byte)Mathf.Max(0, main.g - 42),
                (byte)Mathf.Max(0, main.b - 42),
                255);

            Fill(tex, new Color32(238, 220, 148, 255));
            DrawRect(tex, 140, 48, 200, 124, main);
            DrawRect(tex, 140, 152, 200, 20, shade);
            DrawOutline(tex, 140, 48, 200, 124, outline);
            DrawRect(tex, 186, 92, 24, 24, new Color32(240, 244, 252, 255));
            DrawRect(tex, 270, 92, 24, 24, new Color32(240, 244, 252, 255));
            DrawRect(tex, 228, 128, 24, 8, outline);

            byte[] png = tex.EncodeToPNG();
            Object.DestroyImmediate(tex);
            File.WriteAllBytes($"Assets/Resources/Portraits/pack/{id}.png", png);
        }

        private static void EnsureDir(string path)
        {
            if (AssetDatabase.IsValidFolder(path)) return;
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

        private static void Fill(Texture2D tex, Color32 color)
        {
            Color32[] pixels = tex.GetPixels32();
            for (int i = 0; i < pixels.Length; i += 1) pixels[i] = color;
            tex.SetPixels32(pixels);
        }

        private static void DrawRect(Texture2D tex, int x, int y, int w, int h, Color32 color)
        {
            for (int yy = 0; yy < h; yy += 1)
            {
                for (int xx = 0; xx < w; xx += 1)
                {
                    tex.SetPixel(x + xx, y + yy, color);
                }
            }
        }

        private static void DrawOutline(Texture2D tex, int x, int y, int w, int h, Color32 color)
        {
            DrawRect(tex, x, y, w, 3, color);
            DrawRect(tex, x, y + h - 3, w, 3, color);
            DrawRect(tex, x, y, 3, h, color);
            DrawRect(tex, x + w - 3, y, 3, h, color);
        }
    }
}
