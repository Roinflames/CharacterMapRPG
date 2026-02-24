using UnityEngine;

namespace CharacterMapRPG.BattleCore
{
    public enum PortraitVisualStyle
    {
        Classic = 0,
        DarkIllustrated = 1,
        PixelRetro = 2,
        AssetPack = 3
    }

    internal enum EnemyArchetype
    {
        Wolf,
        Bandit,
        StoneGuardian,
        Witch,
        Dragon,
        Archer,
        Knight,
        PortalLord
    }

    public static class PortraitPainter
    {
        public static Texture2D CreatePortrait(string fighterId, bool isPlayer, int width = 480, int height = 220)
        {
            return CreatePortrait(fighterId, isPlayer, PortraitVisualStyle.DarkIllustrated, width, height);
        }

        public static Texture2D CreatePortrait(string fighterId, bool isPlayer, PortraitVisualStyle style, int width = 480, int height = 220)
        {
            Texture2D tex = new Texture2D(width, height, TextureFormat.RGBA32, false)
            {
                filterMode = FilterMode.Bilinear,
                wrapMode = TextureWrapMode.Clamp
            };

            if (style == PortraitVisualStyle.Classic)
            {
                Color32 bgTop = isPlayer ? new Color32(22, 86, 138, 255) : GetEnemyTopColor(fighterId);
                Color32 bgBottom = isPlayer ? new Color32(10, 39, 70, 255) : GetEnemyBottomColor(fighterId);
                PaintBackground(tex, bgTop, bgBottom);
                PaintRimLight(tex, isPlayer ? new Color32(130, 226, 255, 90) : new Color32(255, 213, 118, 90));
                PaintBody(tex, isPlayer ? new Color32(190, 220, 240, 255) : GetBodyColor(fighterId));
                PaintFace(tex, isPlayer ? new Color32(235, 245, 255, 255) : GetFaceColor(fighterId), fighterId);
                PaintEyes(tex, fighterId);
                PaintMark(tex, fighterId);
                if (!isPlayer) PaintClassicVariantAccent(tex, fighterId);
            }
            else if (style == PortraitVisualStyle.DarkIllustrated)
            {
                PaintDarkPortrait(tex, fighterId, isPlayer);
            }
            else
            {
                PaintPixelRetro(tex, fighterId, isPlayer);
            }

            tex.Apply(false);
            return tex;
        }

        private static void PaintDarkPortrait(Texture2D tex, string fighterId, bool isPlayer)
        {
            Color32 bgTop = isPlayer ? new Color32(18, 56, 88, 255) : new Color32(66, 20, 36, 255);
            Color32 bgBottom = isPlayer ? new Color32(8, 22, 38, 255) : new Color32(20, 8, 16, 255);
            PaintBackground(tex, bgTop, bgBottom);
            PaintRimLight(tex, isPlayer ? new Color32(128, 202, 255, 70) : new Color32(255, 142, 164, 70));

            int cx = tex.width / 2;
            int cy = tex.height / 2 - 6;
            Color32 skin = isPlayer ? new Color32(222, 206, 196, 255) : new Color32(214, 186, 178, 255);
            Color32 hair = ResolveDarkHairColor(fighterId, isPlayer);
            Color32 eye = ResolveDarkEyeColor(fighterId, isPlayer);

            DrawEllipse(tex, cx, cy - 16, tex.width / 7, tex.height / 3, hair);
            DrawEllipse(tex, cx, cy - 10, tex.width / 8, tex.height / 4, skin);
            DrawRoundRect(tex, cx - tex.width / 14, cy - tex.height / 16, tex.width / 7, tex.height / 7, skin, 14);
            DrawRoundRect(tex, cx - tex.width / 12, cy - tex.height / 28, tex.width / 6, tex.height / 16, new Color32(26, 30, 38, 135), 8);

            int eyeY = cy + tex.height / 18;
            int spread = tex.width / 13;
            DrawDisc(tex, cx - spread, eyeY, tex.width / 56, eye);
            DrawDisc(tex, cx + spread, eyeY, tex.width / 56, eye);
            DrawDisc(tex, cx - spread, eyeY, tex.width / 94, new Color32(8, 12, 18, 255));
            DrawDisc(tex, cx + spread, eyeY, tex.width / 94, new Color32(8, 12, 18, 255));

            DrawRoundRect(tex, cx - tex.width / 24, cy - tex.height / 12, tex.width / 12, tex.height / 38, new Color32(160, 68, 86, 190), 4);
            DrawEllipse(tex, cx, cy + tex.height / 5, tex.width / 3, tex.height / 5, new Color32(8, 14, 26, 130));
            if (!isPlayer) PaintDarkVariantFeatures(tex, fighterId, cx, cy);
        }

        private static void PaintPixelRetro(Texture2D tex, string fighterId, bool isPlayer)
        {
            EnemyArchetype archetype = isPlayer ? EnemyArchetype.Wolf : ResolveArchetype(fighterId);
            int px = Mathf.Max(4, tex.width / 64);
            int cx = tex.width / 2;
            int cy = tex.height / 2 + (4 * px);

            Color32 bgA = new Color32(244, 236, 210, 255);
            Color32 bgB = new Color32(232, 214, 156, 255);
            PaintBackground(tex, bgA, bgB);
            DrawDisc(tex, cx, cy + (18 * px), 14 * px, new Color32(42, 48, 56, 60));

            ChibiPalette palette = ResolveChibiPalette(archetype, isPlayer);
            DrawChibiBase(tex, cx, cy, px, palette);

            switch (archetype)
            {
                case EnemyArchetype.Wolf:
                    DrawChibiEars(tex, cx, cy, px, palette);
                    DrawChibiTail(tex, cx, cy, px, palette);
                    break;
                case EnemyArchetype.Bandit:
                    DrawChibiBandana(tex, cx, cy, px, palette);
                    break;
                case EnemyArchetype.StoneGuardian:
                    DrawChibiStonePlates(tex, cx, cy, px, palette);
                    break;
                case EnemyArchetype.Witch:
                    DrawChibiHat(tex, cx, cy, px, palette);
                    break;
                case EnemyArchetype.Dragon:
                    DrawChibiHorns(tex, cx, cy, px, palette);
                    break;
                case EnemyArchetype.Archer:
                    DrawChibiBow(tex, cx, cy, px, palette);
                    break;
                case EnemyArchetype.Knight:
                    DrawChibiHelm(tex, cx, cy, px, palette);
                    break;
                case EnemyArchetype.PortalLord:
                    DrawChibiHalo(tex, cx, cy, px, palette);
                    break;
            }
        }

        private readonly struct ChibiPalette
        {
            public readonly Color32 Main;
            public readonly Color32 Shade;
            public readonly Color32 Accent;
            public readonly Color32 Outline;
            public ChibiPalette(Color32 main, Color32 shade, Color32 accent, Color32 outline)
            {
                Main = main;
                Shade = shade;
                Accent = accent;
                Outline = outline;
            }
        }

        private static ChibiPalette ResolveChibiPalette(EnemyArchetype archetype, bool isPlayer)
        {
            if (isPlayer) return new ChibiPalette(new Color32(170, 198, 232, 255), new Color32(124, 146, 176, 255), new Color32(232, 244, 255, 255), new Color32(40, 50, 66, 255));
            switch (archetype)
            {
                case EnemyArchetype.Wolf: return new ChibiPalette(new Color32(166, 174, 188, 255), new Color32(118, 126, 142, 255), new Color32(230, 236, 245, 255), new Color32(52, 60, 74, 255));
                case EnemyArchetype.Bandit: return new ChibiPalette(new Color32(214, 116, 76, 255), new Color32(164, 82, 52, 255), new Color32(246, 212, 178, 255), new Color32(54, 44, 42, 255));
                case EnemyArchetype.StoneGuardian: return new ChibiPalette(new Color32(162, 168, 174, 255), new Color32(118, 126, 136, 255), new Color32(255, 136, 72, 255), new Color32(58, 60, 68, 255));
                case EnemyArchetype.Witch: return new ChibiPalette(new Color32(188, 142, 224, 255), new Color32(136, 98, 174, 255), new Color32(238, 226, 250, 255), new Color32(56, 44, 72, 255));
                case EnemyArchetype.Dragon: return new ChibiPalette(new Color32(240, 166, 82, 255), new Color32(194, 116, 52, 255), new Color32(252, 236, 170, 255), new Color32(64, 48, 36, 255));
                case EnemyArchetype.Archer: return new ChibiPalette(new Color32(154, 210, 106, 255), new Color32(110, 160, 74, 255), new Color32(236, 250, 214, 255), new Color32(48, 64, 38, 255));
                case EnemyArchetype.Knight: return new ChibiPalette(new Color32(188, 202, 214, 255), new Color32(136, 152, 170, 255), new Color32(244, 248, 252, 255), new Color32(52, 60, 74, 255));
                case EnemyArchetype.PortalLord: return new ChibiPalette(new Color32(126, 180, 246, 255), new Color32(82, 126, 192, 255), new Color32(220, 248, 255, 255), new Color32(40, 52, 82, 255));
                default: return new ChibiPalette(new Color32(188, 140, 214, 255), new Color32(136, 96, 168, 255), new Color32(242, 224, 252, 255), new Color32(56, 42, 74, 255));
            }
        }

        private static void DrawChibiBase(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            FillRect(tex, cx - (10 * s), cy - (8 * s), 20 * s, 16 * s, p.Main);
            FillRect(tex, cx - (9 * s), cy + (6 * s), 18 * s, 5 * s, p.Shade);
            FillRect(tex, cx - (8 * s), cy - (3 * s), 4 * s, 4 * s, p.Accent);
            FillRect(tex, cx + (4 * s), cy - (3 * s), 4 * s, 4 * s, p.Accent);
            FillRect(tex, cx - (2 * s), cy + (2 * s), 4 * s, 2 * s, p.Outline);
            DrawChibiOutline(tex, cx, cy, s, p.Outline);
        }

        private static void DrawChibiOutline(Texture2D tex, int cx, int cy, int s, Color32 outline)
        {
            FillRect(tex, cx - (10 * s), cy - (8 * s), 20 * s, s, outline);
            FillRect(tex, cx - (10 * s), cy + (8 * s), 20 * s, s, outline);
            FillRect(tex, cx - (10 * s), cy - (8 * s), s, 16 * s, outline);
            FillRect(tex, cx + (9 * s), cy - (8 * s), s, 16 * s, outline);
        }

        private static void DrawChibiEars(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            DrawTriangle(tex, new Vector2Int(cx - (8 * s), cy - (8 * s)), new Vector2Int(cx - (3 * s), cy - (16 * s)), new Vector2Int(cx - (1 * s), cy - (8 * s)), p.Main);
            DrawTriangle(tex, new Vector2Int(cx + (8 * s), cy - (8 * s)), new Vector2Int(cx + (3 * s), cy - (16 * s)), new Vector2Int(cx + (1 * s), cy - (8 * s)), p.Main);
        }

        private static void DrawChibiTail(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            FillRect(tex, cx + (10 * s), cy + (2 * s), 6 * s, 3 * s, p.Shade);
        }

        private static void DrawChibiBandana(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            FillRect(tex, cx - (10 * s), cy - (2 * s), 20 * s, 3 * s, p.Outline);
            FillRect(tex, cx + (9 * s), cy - s, 4 * s, 2 * s, p.Outline);
        }

        private static void DrawChibiStonePlates(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            FillRect(tex, cx - (8 * s), cy - (6 * s), 16 * s, 3 * s, p.Shade);
            FillRect(tex, cx - (8 * s), cy + (1 * s), 16 * s, 3 * s, p.Shade);
        }

        private static void DrawChibiHat(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            DrawTriangle(tex, new Vector2Int(cx - (11 * s), cy - (8 * s)), new Vector2Int(cx + (11 * s), cy - (8 * s)), new Vector2Int(cx, cy - (20 * s)), p.Shade);
            FillRect(tex, cx - (12 * s), cy - (8 * s), 24 * s, 2 * s, p.Outline);
        }

        private static void DrawChibiHorns(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            DrawTriangle(tex, new Vector2Int(cx - (8 * s), cy - (8 * s)), new Vector2Int(cx - (3 * s), cy - (16 * s)), new Vector2Int(cx - s, cy - (8 * s)), p.Accent);
            DrawTriangle(tex, new Vector2Int(cx + (8 * s), cy - (8 * s)), new Vector2Int(cx + (3 * s), cy - (16 * s)), new Vector2Int(cx + s, cy - (8 * s)), p.Accent);
        }

        private static void DrawChibiBow(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            FillRect(tex, cx + (10 * s), cy - (6 * s), s, 12 * s, p.Outline);
            DrawDisc(tex, cx + (10 * s), cy - (6 * s), 3 * s, p.Accent);
            DrawDisc(tex, cx + (10 * s), cy + (6 * s), 3 * s, p.Accent);
        }

        private static void DrawChibiHelm(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            FillRect(tex, cx - (9 * s), cy - (8 * s), 18 * s, 4 * s, p.Shade);
            FillRect(tex, cx - s, cy - (8 * s), 2 * s, 7 * s, p.Outline);
        }

        private static void DrawChibiHalo(Texture2D tex, int cx, int cy, int s, ChibiPalette p)
        {
            DrawDisc(tex, cx, cy - (14 * s), 7 * s, new Color32(p.Accent.r, p.Accent.g, p.Accent.b, 160));
            FillRect(tex, cx - (7 * s), cy - (14 * s), 14 * s, 2 * s, p.Accent);
        }

        private static void PaintBackground(Texture2D tex, Color32 top, Color32 bottom)
        {
            int w = tex.width;
            int h = tex.height;
            for (int y = 0; y < h; y += 1)
            {
                float t = (float)y / Mathf.Max(1, h - 1);
                Color c = Color.Lerp(bottom, top, t);
                for (int x = 0; x < w; x += 1)
                {
                    float stripe = Mathf.Sin((x * 0.022f) + (y * 0.006f)) * 0.05f;
                    tex.SetPixel(x, y, c * (0.92f + stripe));
                }
            }
        }

        private static void PaintRimLight(Texture2D tex, Color32 lightColor)
        {
            DrawDisc(tex, tex.width / 4, tex.height - 8, tex.height / 2, lightColor);
            DrawDisc(tex, (tex.width * 4) / 5, tex.height + 18, tex.height / 3, lightColor);
        }

        private static void PaintBody(Texture2D tex, Color32 bodyColor)
        {
            int cx = tex.width / 2;
            int cy = tex.height / 2 - 12;
            DrawEllipse(tex, cx, cy, tex.width / 7, tex.height / 3, bodyColor);
            DrawEllipse(tex, cx, cy + tex.height / 5, tex.width / 3, tex.height / 5, new Color32(15, 28, 55, 140));
            DrawRoundRect(tex, cx - tex.width / 5, cy + tex.height / 10, tex.width / 3, tex.height / 22, new Color32(35, 43, 54, 210), 8);
        }

        private static void PaintFace(Texture2D tex, Color32 faceColor, string fighterId)
        {
            int cx = tex.width / 2;
            int cy = tex.height / 2 - 10;
            DrawRoundRect(tex, cx - tex.width / 18, cy - tex.height / 16, tex.width / 9, tex.height / 7, faceColor, 12);

            if (fighterId.Contains("dragon"))
            {
                DrawTriangle(tex, new Vector2Int(cx - 22, cy + 40), new Vector2Int(cx - 8, cy + 70), new Vector2Int(cx - 2, cy + 38), new Color32(230, 130, 100, 255));
                DrawTriangle(tex, new Vector2Int(cx + 22, cy + 40), new Vector2Int(cx + 8, cy + 70), new Vector2Int(cx + 2, cy + 38), new Color32(230, 130, 100, 255));
            }
            else if (fighterId.Contains("bruja") || fighterId.Contains("sombrio"))
            {
                DrawTriangle(tex, new Vector2Int(cx - 32, cy + 25), new Vector2Int(cx + 32, cy + 25), new Vector2Int(cx, cy + 78), new Color32(48, 22, 80, 230));
            }
        }

        private static void PaintEyes(Texture2D tex, string fighterId)
        {
            int cx = tex.width / 2;
            int cy = tex.height / 2 + 15;
            int spread = tex.width / 12;
            Color32 iris = fighterId.Contains("portal") ? new Color32(120, 220, 255, 255) : new Color32(250, 250, 250, 255);
            DrawDisc(tex, cx - spread, cy, tex.width / 42, iris);
            DrawDisc(tex, cx + spread, cy, tex.width / 42, iris);
            DrawDisc(tex, cx - spread, cy, tex.width / 80, new Color32(10, 18, 24, 255));
            DrawDisc(tex, cx + spread, cy, tex.width / 80, new Color32(10, 18, 24, 255));
        }

        private static void PaintMark(Texture2D tex, string fighterId)
        {
            int cx = tex.width / 2;
            int y = tex.height / 3;
            if (fighterId.Contains("bandido"))
            {
                DrawRoundRect(tex, cx - 30, y, 60, 8, new Color32(130, 20, 28, 255), 4);
            }
            else if (fighterId.Contains("portal"))
            {
                DrawRoundRect(tex, cx - 18, y + 2, 36, 8, new Color32(106, 190, 255, 255), 4);
            }
            else
            {
                DrawRoundRect(tex, cx - 24, y + 2, 48, 8, new Color32(55, 70, 92, 190), 4);
            }
        }

        private static Color32 GetEnemyTopColor(string id)
        {
            if (id.Contains("portal")) return new Color32(35, 94, 142, 255);
            if (id.Contains("dragon")) return new Color32(128, 52, 48, 255);
            if (id.Contains("bruja")) return new Color32(78, 45, 110, 255);
            return new Color32(109, 36, 48, 255);
        }

        private static Color32 GetEnemyBottomColor(string id)
        {
            if (id.Contains("portal")) return new Color32(20, 41, 82, 255);
            if (id.Contains("dragon")) return new Color32(72, 18, 20, 255);
            if (id.Contains("bruja")) return new Color32(32, 16, 56, 255);
            return new Color32(52, 12, 18, 255);
        }

        private static Color32 GetBodyColor(string id)
        {
            if (id.Contains("piedra")) return new Color32(150, 162, 180, 255);
            if (id.Contains("dragon")) return new Color32(224, 105, 98, 255);
            if (id.Contains("sombrio")) return new Color32(180, 190, 240, 255);
            if (id.Contains("bruja")) return new Color32(192, 156, 228, 255);
            return new Color32(252, 112, 142, 255);
        }

        private static Color32 GetFaceColor(string id)
        {
            if (id.Contains("dragon")) return new Color32(242, 232, 198, 255);
            if (id.Contains("piedra")) return new Color32(224, 228, 238, 255);
            if (id.Contains("portal")) return new Color32(204, 233, 246, 255);
            return new Color32(236, 242, 248, 255);
        }

        private static Color32 ResolveDarkHairColor(string id, bool isPlayer)
        {
            if (isPlayer) return new Color32(62, 70, 92, 255);
            if (id.Contains("bruja")) return new Color32(86, 44, 110, 255);
            if (id.Contains("dragon")) return new Color32(128, 40, 52, 255);
            if (id.Contains("portal")) return new Color32(56, 84, 132, 255);
            return new Color32(72, 34, 54, 255);
        }

        private static Color32 ResolveDarkEyeColor(string id, bool isPlayer)
        {
            if (isPlayer) return new Color32(136, 216, 255, 255);
            if (id.Contains("portal")) return new Color32(150, 220, 255, 255);
            if (id.Contains("sombrio")) return new Color32(196, 168, 255, 255);
            return new Color32(255, 190, 200, 255);
        }

        private static Color32 ResolveWolfColor(string id)
        {
            if (id.Contains("sombrio")) return new Color32(148, 150, 168, 255);
            if (id.Contains("ceniza")) return new Color32(166, 154, 144, 255);
            if (id.Contains("dragon")) return new Color32(188, 104, 82, 255);
            return new Color32(164, 164, 164, 255);
        }

        private static EnemyArchetype ResolveArchetype(string fighterId)
        {
            if (fighterId.Contains("portal")) return EnemyArchetype.PortalLord;
            if (fighterId.Contains("dragon")) return EnemyArchetype.Dragon;
            if (fighterId.Contains("bruja")) return EnemyArchetype.Witch;
            if (fighterId.Contains("piedra")) return EnemyArchetype.StoneGuardian;
            if (fighterId.Contains("bandido")) return EnemyArchetype.Bandit;
            if (fighterId.Contains("arquero")) return EnemyArchetype.Archer;
            if (fighterId.Contains("caballero")) return EnemyArchetype.Knight;
            return EnemyArchetype.Wolf;
        }

        private static void PaintClassicVariantAccent(Texture2D tex, string fighterId)
        {
            EnemyArchetype archetype = ResolveArchetype(fighterId);
            int cx = tex.width / 2;
            int cy = tex.height / 2 - 6;
            switch (archetype)
            {
                case EnemyArchetype.StoneGuardian:
                    DrawRoundRect(tex, cx - 56, cy - 18, 112, 18, new Color32(112, 120, 134, 235), 3);
                    DrawRoundRect(tex, cx - 44, cy + 28, 88, 14, new Color32(92, 98, 110, 220), 3);
                    break;
                case EnemyArchetype.Dragon:
                    DrawTriangle(tex, new Vector2Int(cx - 48, cy + 22), new Vector2Int(cx - 26, cy + 74), new Vector2Int(cx - 10, cy + 16), new Color32(216, 104, 86, 255));
                    DrawTriangle(tex, new Vector2Int(cx + 48, cy + 22), new Vector2Int(cx + 26, cy + 74), new Vector2Int(cx + 10, cy + 16), new Color32(216, 104, 86, 255));
                    break;
                case EnemyArchetype.Witch:
                    DrawTriangle(tex, new Vector2Int(cx - 74, cy + 20), new Vector2Int(cx + 74, cy + 20), new Vector2Int(cx, cy + 98), new Color32(44, 26, 76, 230));
                    break;
                case EnemyArchetype.Bandit:
                    DrawRoundRect(tex, cx - 60, cy + 14, 120, 14, new Color32(110, 24, 28, 240), 6);
                    break;
                case EnemyArchetype.Archer:
                    DrawRoundRect(tex, cx + 48, cy - 8, 12, 74, new Color32(164, 120, 80, 235), 4);
                    DrawRoundRect(tex, cx + 56, cy + 2, 6, 52, new Color32(212, 186, 140, 255), 3);
                    break;
                case EnemyArchetype.Knight:
                    DrawRoundRect(tex, cx - 52, cy + 16, 104, 16, new Color32(166, 168, 178, 220), 6);
                    DrawRoundRect(tex, cx - 12, cy + 30, 24, 24, new Color32(74, 84, 98, 225), 4);
                    break;
                case EnemyArchetype.PortalLord:
                    DrawDisc(tex, cx, cy + 60, 20, new Color32(110, 198, 255, 120));
                    DrawRoundRect(tex, cx - 30, cy + 40, 60, 10, new Color32(122, 220, 255, 240), 4);
                    break;
                case EnemyArchetype.Wolf:
                    DrawTriangle(tex, new Vector2Int(cx - 42, cy + 34), new Vector2Int(cx - 28, cy + 72), new Vector2Int(cx - 14, cy + 32), new Color32(170, 180, 210, 255));
                    DrawTriangle(tex, new Vector2Int(cx + 42, cy + 34), new Vector2Int(cx + 28, cy + 72), new Vector2Int(cx + 14, cy + 32), new Color32(170, 180, 210, 255));
                    break;
            }
        }

        private static void PaintDarkVariantFeatures(Texture2D tex, string fighterId, int cx, int cy)
        {
            EnemyArchetype archetype = ResolveArchetype(fighterId);
            switch (archetype)
            {
                case EnemyArchetype.StoneGuardian:
                    DrawRoundRect(tex, cx - 56, cy + 20, 112, 20, new Color32(88, 92, 98, 220), 4);
                    DrawRoundRect(tex, cx - 48, cy - 26, 96, 12, new Color32(116, 120, 130, 230), 4);
                    break;
                case EnemyArchetype.Dragon:
                    DrawTriangle(tex, new Vector2Int(cx - 52, cy + 16), new Vector2Int(cx - 18, cy + 74), new Vector2Int(cx - 2, cy + 10), new Color32(156, 44, 52, 235));
                    DrawTriangle(tex, new Vector2Int(cx + 52, cy + 16), new Vector2Int(cx + 18, cy + 74), new Vector2Int(cx + 2, cy + 10), new Color32(156, 44, 52, 235));
                    break;
                case EnemyArchetype.Witch:
                    DrawTriangle(tex, new Vector2Int(cx - 82, cy + 22), new Vector2Int(cx + 82, cy + 22), new Vector2Int(cx, cy + 108), new Color32(24, 16, 38, 230));
                    DrawRoundRect(tex, cx - 56, cy + 12, 112, 9, new Color32(78, 46, 116, 255), 4);
                    break;
                case EnemyArchetype.Bandit:
                    DrawRoundRect(tex, cx - 66, cy + 10, 132, 16, new Color32(90, 20, 26, 235), 6);
                    break;
                case EnemyArchetype.Archer:
                    DrawRoundRect(tex, cx + 54, cy - 10, 10, 82, new Color32(142, 104, 72, 230), 3);
                    DrawRoundRect(tex, cx + 60, cy + 2, 5, 60, new Color32(212, 190, 136, 255), 3);
                    break;
                case EnemyArchetype.Knight:
                    DrawRoundRect(tex, cx - 18, cy + 10, 36, 18, new Color32(80, 86, 102, 230), 4);
                    DrawRoundRect(tex, cx - 60, cy + 16, 120, 14, new Color32(126, 130, 146, 220), 4);
                    break;
                case EnemyArchetype.PortalLord:
                    DrawDisc(tex, cx, cy + 60, 24, new Color32(84, 198, 255, 80));
                    DrawRoundRect(tex, cx - 34, cy + 42, 68, 10, new Color32(140, 230, 255, 245), 4);
                    break;
                case EnemyArchetype.Wolf:
                    DrawTriangle(tex, new Vector2Int(cx - 40, cy + 28), new Vector2Int(cx - 24, cy + 72), new Vector2Int(cx - 10, cy + 26), new Color32(124, 132, 164, 250));
                    DrawTriangle(tex, new Vector2Int(cx + 40, cy + 28), new Vector2Int(cx + 24, cy + 72), new Vector2Int(cx + 10, cy + 26), new Color32(124, 132, 164, 250));
                    break;
            }
        }

        private static void DrawEllipse(Texture2D tex, int cx, int cy, int rx, int ry, Color32 color)
        {
            for (int y = -ry; y <= ry; y += 1)
            {
                float yy = (float)(y * y) / (ry * ry);
                int span = Mathf.FloorToInt(rx * Mathf.Sqrt(Mathf.Max(0f, 1f - yy)));
                for (int x = -span; x <= span; x += 1)
                {
                    SetPixelSafe(tex, cx + x, cy + y, color);
                }
            }
        }

        private static void DrawDisc(Texture2D tex, int cx, int cy, int radius, Color32 color)
        {
            int rr = radius * radius;
            for (int y = -radius; y <= radius; y += 1)
            {
                for (int x = -radius; x <= radius; x += 1)
                {
                    if ((x * x) + (y * y) > rr) continue;
                    SetPixelSafe(tex, cx + x, cy + y, color);
                }
            }
        }

        private static void DrawRoundRect(Texture2D tex, int x, int y, int w, int h, Color32 color, int radius)
        {
            for (int yy = 0; yy < h; yy += 1)
            {
                for (int xx = 0; xx < w; xx += 1)
                {
                    int dx = Mathf.Min(xx, w - 1 - xx);
                    int dy = Mathf.Min(yy, h - 1 - yy);
                    if (dx < radius && dy < radius)
                    {
                        int cx = radius - dx;
                        int cy = radius - dy;
                        if ((cx * cx) + (cy * cy) > radius * radius) continue;
                    }
                    SetPixelSafe(tex, x + xx, y + yy, color);
                }
            }
        }

        private static void DrawTriangle(Texture2D tex, Vector2Int a, Vector2Int b, Vector2Int c, Color32 color)
        {
            int minX = Mathf.Min(a.x, Mathf.Min(b.x, c.x));
            int maxX = Mathf.Max(a.x, Mathf.Max(b.x, c.x));
            int minY = Mathf.Min(a.y, Mathf.Min(b.y, c.y));
            int maxY = Mathf.Max(a.y, Mathf.Max(b.y, c.y));

            for (int y = minY; y <= maxY; y += 1)
            {
                for (int x = minX; x <= maxX; x += 1)
                {
                    if (PointInTriangle(new Vector2Int(x, y), a, b, c))
                    {
                        SetPixelSafe(tex, x, y, color);
                    }
                }
            }
        }

        private static bool PointInTriangle(Vector2Int p, Vector2Int a, Vector2Int b, Vector2Int c)
        {
            float d1 = Sign(p, a, b);
            float d2 = Sign(p, b, c);
            float d3 = Sign(p, c, a);
            bool hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
            bool hasPos = d1 > 0 || d2 > 0 || d3 > 0;
            return !(hasNeg && hasPos);
        }

        private static float Sign(Vector2Int p1, Vector2Int p2, Vector2Int p3)
        {
            return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
        }

        private static void SetPixelSafe(Texture2D tex, int x, int y, Color32 color)
        {
            if (x < 0 || y < 0 || x >= tex.width || y >= tex.height) return;
            tex.SetPixel(x, y, color);
        }

        private static void FillRect(Texture2D tex, int x, int y, int w, int h, Color32 color)
        {
            for (int yy = 0; yy < h; yy += 1)
            {
                for (int xx = 0; xx < w; xx += 1)
                {
                    SetPixelSafe(tex, x + xx, y + yy, color);
                }
            }
        }

        private static void DrawPixelMoon(Texture2D tex, int x, int y, int r)
        {
            DrawDisc(tex, x, y, r, new Color32(172, 180, 192, 255));
            DrawDisc(tex, x + (r / 3), y - (r / 4), r / 2, new Color32(215, 221, 230, 255));
        }

        private static void DrawPixelTree(Texture2D tex, int x, int y, int s)
        {
            FillRect(tex, x + (2 * s), y + (8 * s), 2 * s, 10 * s, new Color32(118, 68, 32, 255));
            DrawTriangle(tex, new Vector2Int(x, y + (9 * s)), new Vector2Int(x + (8 * s), y + (9 * s)), new Vector2Int(x + (4 * s), y), new Color32(36, 128, 44, 255));
            DrawTriangle(tex, new Vector2Int(x + s, y + (6 * s)), new Vector2Int(x + (7 * s), y + (6 * s)), new Vector2Int(x + (4 * s), y - (3 * s)), new Color32(48, 156, 54, 255));
        }

        private static void DrawPixelWolf(Texture2D tex, int x, int y, int s, Color32 fur)
        {
            FillRect(tex, x + (2 * s), y + (5 * s), 16 * s, 6 * s, fur);
            FillRect(tex, x + (16 * s), y + (3 * s), 6 * s, 4 * s, fur);
            FillRect(tex, x + (22 * s), y + (4 * s), 4 * s, 3 * s, fur);
            FillRect(tex, x + (5 * s), y + (11 * s), 2 * s, 6 * s, new Color32(56, 48, 42, 255));
            FillRect(tex, x + (11 * s), y + (11 * s), 2 * s, 6 * s, new Color32(56, 48, 42, 255));
            FillRect(tex, x + (18 * s), y + (11 * s), 2 * s, 6 * s, new Color32(56, 48, 42, 255));
            FillRect(tex, x + (1 * s), y + (6 * s), 3 * s, 2 * s, fur);
            FillRect(tex, x + (24 * s), y + (5 * s), s, s, new Color32(228, 230, 232, 255));
            FillRect(tex, x + (25 * s), y + (5 * s), s, s, new Color32(28, 26, 24, 255));
        }

        private static void DrawPixelGolem(Texture2D tex, int x, int y, int s)
        {
            FillRect(tex, x + (6 * s), y + (2 * s), 12 * s, 8 * s, new Color32(136, 130, 120, 255));
            FillRect(tex, x + (4 * s), y + (10 * s), 16 * s, 11 * s, new Color32(120, 114, 104, 255));
            FillRect(tex, x + (2 * s), y + (12 * s), 4 * s, 8 * s, new Color32(112, 108, 100, 255));
            FillRect(tex, x + (18 * s), y + (12 * s), 4 * s, 8 * s, new Color32(112, 108, 100, 255));
            FillRect(tex, x + (8 * s), y + (21 * s), 4 * s, 6 * s, new Color32(98, 96, 90, 255));
            FillRect(tex, x + (14 * s), y + (21 * s), 4 * s, 6 * s, new Color32(98, 96, 90, 255));
            FillRect(tex, x + (9 * s), y + (5 * s), 2 * s, s, new Color32(255, 120, 62, 255));
            FillRect(tex, x + (13 * s), y + (5 * s), 2 * s, s, new Color32(255, 120, 62, 255));
            FillRect(tex, x + (8 * s), y + (14 * s), 8 * s, 2 * s, new Color32(84, 82, 76, 255));
        }

        private static void DrawPixelBandit(Texture2D tex, int x, int y, int s)
        {
            FillRect(tex, x + (6 * s), y + (2 * s), 8 * s, 5 * s, new Color32(232, 198, 176, 255));
            FillRect(tex, x + (4 * s), y + (7 * s), 12 * s, 9 * s, new Color32(146, 38, 52, 255));
            FillRect(tex, x + (2 * s), y + (8 * s), 4 * s, 2 * s, new Color32(212, 214, 222, 255));
            FillRect(tex, x + (14 * s), y + (8 * s), 4 * s, 2 * s, new Color32(212, 214, 222, 255));
            FillRect(tex, x + (5 * s), y + (16 * s), 3 * s, 5 * s, new Color32(56, 48, 48, 255));
            FillRect(tex, x + (12 * s), y + (16 * s), 3 * s, 5 * s, new Color32(56, 48, 48, 255));
        }

        private static void DrawPixelDragon(Texture2D tex, int x, int y, int s)
        {
            FillRect(tex, x + (6 * s), y + (4 * s), 14 * s, 9 * s, new Color32(188, 84, 74, 255));
            FillRect(tex, x + (2 * s), y + (9 * s), 6 * s, 3 * s, new Color32(146, 64, 56, 255));
            FillRect(tex, x + (18 * s), y + (8 * s), 6 * s, 3 * s, new Color32(146, 64, 56, 255));
            FillRect(tex, x + (10 * s), y + (1 * s), 3 * s, 3 * s, new Color32(226, 186, 92, 255));
            FillRect(tex, x + (12 * s), y + (2 * s), 2 * s, 2 * s, new Color32(226, 186, 92, 255));
            FillRect(tex, x + (8 * s), y + (13 * s), 4 * s, 6 * s, new Color32(98, 46, 38, 255));
            FillRect(tex, x + (14 * s), y + (13 * s), 4 * s, 6 * s, new Color32(98, 46, 38, 255));
        }

        private static void DrawPixelWitch(Texture2D tex, int x, int y, int s)
        {
            DrawTriangle(tex, new Vector2Int(x + (2 * s), y + (8 * s)), new Vector2Int(x + (18 * s), y + (8 * s)), new Vector2Int(x + (10 * s), y), new Color32(82, 46, 114, 255));
            FillRect(tex, x + (6 * s), y + (8 * s), 8 * s, 8 * s, new Color32(116, 74, 156, 255));
            FillRect(tex, x + (8 * s), y + (4 * s), 4 * s, 3 * s, new Color32(232, 204, 188, 255));
            FillRect(tex, x + (8 * s), y + (16 * s), 3 * s, 5 * s, new Color32(42, 26, 62, 255));
            FillRect(tex, x + (11 * s), y + (16 * s), 3 * s, 5 * s, new Color32(42, 26, 62, 255));
        }

        private static void DrawPixelArcher(Texture2D tex, int x, int y, int s)
        {
            FillRect(tex, x + (6 * s), y + (2 * s), 8 * s, 5 * s, new Color32(222, 196, 176, 255));
            FillRect(tex, x + (5 * s), y + (7 * s), 10 * s, 9 * s, new Color32(66, 106, 74, 255));
            FillRect(tex, x + (15 * s), y + (6 * s), s, 12 * s, new Color32(168, 126, 82, 255));
            FillRect(tex, x + (16 * s), y + (8 * s), s, 8 * s, new Color32(218, 194, 142, 255));
            FillRect(tex, x + (6 * s), y + (16 * s), 3 * s, 5 * s, new Color32(48, 56, 52, 255));
            FillRect(tex, x + (11 * s), y + (16 * s), 3 * s, 5 * s, new Color32(48, 56, 52, 255));
        }

        private static void DrawPixelKnight(Texture2D tex, int x, int y, int s)
        {
            FillRect(tex, x + (6 * s), y + (2 * s), 8 * s, 5 * s, new Color32(180, 186, 198, 255));
            FillRect(tex, x + (5 * s), y + (7 * s), 10 * s, 9 * s, new Color32(124, 132, 146, 255));
            FillRect(tex, x + (4 * s), y + (8 * s), s, 10 * s, new Color32(138, 146, 160, 255));
            FillRect(tex, x + (15 * s), y + (8 * s), s, 10 * s, new Color32(138, 146, 160, 255));
            FillRect(tex, x + (6 * s), y + (16 * s), 3 * s, 5 * s, new Color32(54, 58, 68, 255));
            FillRect(tex, x + (11 * s), y + (16 * s), 3 * s, 5 * s, new Color32(54, 58, 68, 255));
        }

        private static void DrawPixelPortalLord(Texture2D tex, int x, int y, int s)
        {
            FillRect(tex, x + (5 * s), y + (3 * s), 12 * s, 12 * s, new Color32(54, 118, 162, 255));
            FillRect(tex, x + (8 * s), y + (6 * s), 6 * s, 5 * s, new Color32(212, 226, 236, 255));
            FillRect(tex, x + (8 * s), y + (15 * s), 3 * s, 6 * s, new Color32(28, 46, 70, 255));
            FillRect(tex, x + (11 * s), y + (15 * s), 3 * s, 6 * s, new Color32(28, 46, 70, 255));
            DrawDisc(tex, x + (11 * s), y + (10 * s), 4 * s, new Color32(116, 220, 255, 90));
        }
    }
}
