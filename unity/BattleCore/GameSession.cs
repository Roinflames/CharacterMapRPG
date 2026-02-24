using System.Collections.Generic;
using UnityEngine;

namespace CharacterMapRPG.BattleCore
{
    public sealed class GameSession : MonoBehaviour
    {
        public static GameSession Instance { get; private set; }

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

        [SerializeField] private BattleProgression progression = new BattleProgression();
        [SerializeField] private List<string> completedEncounterIds = new List<string>();
        [SerializeField] private string pendingEncounterId = "";
        [SerializeField] private string currentRouteId = "route1";

        public FighterStats PlayerStats => playerStats;
        public BattleProgression Progression => progression;
        public string PendingEncounterId => pendingEncounterId;
        public string CurrentRouteId => currentRouteId;

        private Dictionary<string, RouteDefinition> _routes;
        private readonly Dictionary<string, Vector2Int> _routePositions = new Dictionary<string, Vector2Int>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
            progression.ConfigureLevel3Boss("lvl3_boss_portal", true);
            EnsureRoutes();
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void EnsureSession()
        {
            if (Instance != null) return;
            var go = new GameObject("GameSession");
            go.AddComponent<GameSession>();
        }

        public void StartEncounter(string encounterId)
        {
            pendingEncounterId = encounterId;
            SceneFlow.LoadBattleScene();
        }

        public void ClearPendingEncounter()
        {
            pendingEncounterId = "";
        }

        public bool IsEncounterCompleted(string encounterId)
        {
            return completedEncounterIds.Contains(encounterId);
        }

        public void SyncPlayerCurrentHp(int hp)
        {
            playerStats.CurrentHp = Mathf.Clamp(hp, 0, playerStats.MaxHp);
        }

        public void ResolveBattleResult(EncounterDefinition encounter, bool victory, bool escaped)
        {
            if (encounter == null) return;
            if (escaped) return;

            if (victory)
            {
                if (!completedEncounterIds.Contains(encounter.Id))
                {
                    completedEncounterIds.Add(encounter.Id);
                }

                progression.GainExp(encounter.ExpReward);
                if (encounter.IsBoss)
                {
                    progression.MarkBossVictory(encounter.Id);
                }
                return;
            }

            // On defeat: send player back to route start and restore HP so progression can continue.
            RouteDefinition route = GetCurrentRoute();
            if (route != null)
            {
                _routePositions[currentRouteId] = route.Start;
                RespawnRouteEncounters(route);
            }
            playerStats.CurrentHp = playerStats.MaxHp;
        }

        public RouteDefinition GetCurrentRoute()
        {
            EnsureRoutes();
            if (_routes.TryGetValue(currentRouteId, out var route)) return route;
            return null;
        }

        public Vector2Int GetPlayerPosition()
        {
            EnsureRoutes();
            if (_routePositions.TryGetValue(currentRouteId, out var pos)) return pos;
            var route = GetCurrentRoute();
            return route != null ? route.Start : Vector2Int.zero;
        }

        public bool TryMovePlayer(int dx, int dy, out string message, out string encounterId)
        {
            message = "";
            encounterId = "";
            RouteDefinition route = GetCurrentRoute();
            if (route == null)
            {
                message = "Ruta no disponible.";
                return false;
            }

            Vector2Int current = GetPlayerPosition();
            Vector2Int next = new Vector2Int(current.x + dx, current.y + dy);
            if (next.y < 0 || next.y >= route.Height || next.x < 0 || next.x >= route.Width)
            {
                return false;
            }

            if (route.Map[next.y][next.x] == 1)
            {
                return false;
            }

            _routePositions[currentRouteId] = next;

            foreach (var healSpot in route.HealSpots)
            {
                if (healSpot != next) continue;
                if (playerStats.CurrentHp < playerStats.MaxHp)
                {
                    playerStats.CurrentHp = playerStats.MaxHp;
                    message = "Santuario: HP restaurado al maximo.";
                }
                else
                {
                    message = "Santuario: ya tienes HP completo.";
                }
                break;
            }

            foreach (var milestone in route.Milestones)
            {
                if (milestone.Position == next && !IsEncounterCompleted(milestone.EncounterId))
                {
                    encounterId = milestone.EncounterId;
                    message = $"Encuentro activado: {milestone.Id}";
                    return true;
                }
            }

            if (route.Map[next.y][next.x] == 2)
            {
                bool allMilestonesDone = true;
                foreach (var milestone in route.Milestones)
                {
                    if (!IsEncounterCompleted(milestone.EncounterId))
                    {
                        allMilestonesDone = false;
                        break;
                    }
                }

                if (!allMilestonesDone)
                {
                    message = "La meta final esta sellada. Completa los hitos.";
                    return true;
                }

                if (currentRouteId == "route1" && _routes.ContainsKey("route2"))
                {
                    currentRouteId = "route2";
                    if (!_routePositions.ContainsKey(currentRouteId))
                    {
                        _routePositions[currentRouteId] = _routes[currentRouteId].Start;
                    }
                    message = "Ruta 1 completada. Pasas a Ruta 2.";
                    return true;
                }

                if (currentRouteId == "route2")
                {
                    if (!progression.Level3BossDefeated)
                    {
                        if (progression.Level < 3)
                        {
                            message = $"Te falta nivel para el jefe final. Requerido: nivel 3 (actual: {progression.Level}).";
                            return true;
                        }

                        encounterId = progression.Level3BossEncounterId;
                        message = "Jefe final desbloqueado: Senor del Portal.";
                        return true;
                    }

                    message = "Has completado todas las rutas y derrotaste al jefe final.";
                    return true;
                }

                message = "Has completado todas las rutas.";
            }

            return true;
        }

        private void RespawnRouteEncounters(RouteDefinition route)
        {
            if (route == null) return;
            for (int i = completedEncounterIds.Count - 1; i >= 0; i -= 1)
            {
                string id = completedEncounterIds[i];
                bool belongsToRoute = false;
                for (int j = 0; j < route.Milestones.Count; j += 1)
                {
                    if (route.Milestones[j].EncounterId != id) continue;
                    belongsToRoute = true;
                    break;
                }

                if (!belongsToRoute) continue;
                if (progression.IsBossEncounter(id)) continue;
                completedEncounterIds.RemoveAt(i);
            }
        }

        private void EnsureRoutes()
        {
            if (_routes != null && _routes.Count > 0) return;
            _routes = RouteMapCatalog.CreateDefaults();
            foreach (var kv in _routes)
            {
                if (!_routePositions.ContainsKey(kv.Key))
                {
                    _routePositions[kv.Key] = kv.Value.Start;
                }
            }
        }
    }
}
