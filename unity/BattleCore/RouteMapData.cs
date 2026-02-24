using System.Collections.Generic;
using UnityEngine;

namespace CharacterMapRPG.BattleCore
{
    public sealed class RouteMilestone
    {
        public string Id;
        public string EncounterId;
        public Vector2Int Position;
    }

    public sealed class RouteDefinition
    {
        public string Id;
        public string Label;
        public Vector2Int Start;
        public int[][] Map;
        public List<RouteMilestone> Milestones = new List<RouteMilestone>();

        public int Width => Map != null && Map.Length > 0 ? Map[0].Length : 0;
        public int Height => Map?.Length ?? 0;
    }

    public static class RouteMapCatalog
    {
        public static Dictionary<string, RouteDefinition> CreateDefaults()
        {
            var route1 = new RouteDefinition
            {
                Id = "route1",
                Label = "Ruta 1",
                Start = new Vector2Int(1, 1),
                Map = new[]
                {
                    new[] {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1},
                    new[] {1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1},
                    new[] {1,0,1,1,1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1},
                    new[] {1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,1},
                    new[] {1,0,1,0,1,1,0,1,0,1,1,1,1,0,1,1,0,1,0,1},
                    new[] {1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,1},
                    new[] {1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,0,1},
                    new[] {1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1},
                    new[] {1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1},
                    new[] {1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,1},
                    new[] {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1},
                }
            };
            route1.Milestones.Add(new RouteMilestone { Id = "r1m1", EncounterId = "r1m1", Position = new Vector2Int(4, 1) });
            route1.Milestones.Add(new RouteMilestone { Id = "r1m2", EncounterId = "r1m2", Position = new Vector2Int(8, 5) });
            route1.Milestones.Add(new RouteMilestone { Id = "r1m3", EncounterId = "r1m3", Position = new Vector2Int(13, 7) });
            route1.Milestones.Add(new RouteMilestone { Id = "r1m4", EncounterId = "r1m4", Position = new Vector2Int(17, 9) });

            var route2 = new RouteDefinition
            {
                Id = "route2",
                Label = "Ruta 2",
                Start = new Vector2Int(1, 9),
                Map = new[]
                {
                    new[] {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1},
                    new[] {1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,2,1},
                    new[] {1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1},
                    new[] {1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1},
                    new[] {1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1},
                    new[] {1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1},
                    new[] {1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,0,1},
                    new[] {1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1},
                    new[] {1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1},
                    new[] {1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1},
                    new[] {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1},
                }
            };
            route2.Milestones.Add(new RouteMilestone { Id = "r2m1", EncounterId = "r2m1", Position = new Vector2Int(3, 9) });
            route2.Milestones.Add(new RouteMilestone { Id = "r2m2", EncounterId = "r2m2", Position = new Vector2Int(7, 9) });
            route2.Milestones.Add(new RouteMilestone { Id = "r2m3", EncounterId = "r2m3", Position = new Vector2Int(11, 7) });
            route2.Milestones.Add(new RouteMilestone { Id = "r2m4", EncounterId = "r2m4", Position = new Vector2Int(15, 3) });
            route2.Milestones.Add(new RouteMilestone { Id = "r2m5", EncounterId = "r2m5", Position = new Vector2Int(17, 1) });

            return new Dictionary<string, RouteDefinition>
            {
                ["route1"] = route1,
                ["route2"] = route2
            };
        }
    }
}
