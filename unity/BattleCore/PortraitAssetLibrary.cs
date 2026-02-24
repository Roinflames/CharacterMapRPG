using UnityEngine;

namespace CharacterMapRPG.BattleCore
{
    public static class PortraitAssetLibrary
    {
        public static Texture2D TryLoad(string fighterId, bool isPlayer, PortraitVisualStyle style)
        {
            string styleFolder = StyleFolder(style);
            string archetype = isPlayer ? "player" : ResolveArchetypeName(fighterId);

            string[] candidates =
            {
                $"Portraits/{styleFolder}/{fighterId}",
                $"Portraits/{styleFolder}/{archetype}",
                isPlayer ? $"Portraits/{styleFolder}/default_player" : $"Portraits/{styleFolder}/default_enemy",
                $"Portraits/shared/{fighterId}",
                $"Portraits/shared/{archetype}",
                isPlayer ? "Portraits/shared/default_player" : "Portraits/shared/default_enemy",
            };

            foreach (string path in candidates)
            {
                Texture2D tex = Resources.Load<Texture2D>(path);
                if (tex != null) return tex;
            }

            return null;
        }

        private static string StyleFolder(PortraitVisualStyle style)
        {
            switch (style)
            {
                case PortraitVisualStyle.Classic:
                    return "classic";
                case PortraitVisualStyle.DarkIllustrated:
                    return "dark";
                case PortraitVisualStyle.PixelRetro:
                    return "pixel";
                case PortraitVisualStyle.AssetPack:
                    return "pack";
                default:
                    return "pack";
            }
        }

        private static string ResolveArchetypeName(string fighterId)
        {
            if (fighterId.Contains("portal")) return "portal_lord";
            if (fighterId.Contains("dragon")) return "dragon";
            if (fighterId.Contains("bruja")) return "witch";
            if (fighterId.Contains("piedra")) return "stone_guardian";
            if (fighterId.Contains("bandido")) return "bandit";
            if (fighterId.Contains("arquero")) return "archer";
            if (fighterId.Contains("caballero")) return "knight";
            return "wolf";
        }
    }
}
