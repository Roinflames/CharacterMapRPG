using UnityEngine.SceneManagement;
using UnityEngine;

#if UNITY_EDITOR
using UnityEditor.SceneManagement;
#endif

namespace CharacterMapRPG.BattleCore
{
    public static class SceneFlow
    {
        public const string BattleSceneName = "BattleScene";
        public const string BattleScenePath = "Assets/Scenes/BattleScene.unity";
        public const string MapSceneName = "MapScene";
        public const string MapScenePath = "Assets/Scenes/MapScene.unity";

        public static void LoadBattleScene()
        {
            LoadScene(BattleSceneName, BattleScenePath);
        }

        public static void LoadMapScene()
        {
            LoadScene(MapSceneName, MapScenePath);
        }

        private static void LoadScene(string sceneName, string scenePath)
        {
#if UNITY_EDITOR
            if (SceneManager.GetSceneByName(sceneName).isLoaded || Application.CanStreamedLevelBeLoaded(sceneName))
            {
                SceneManager.LoadScene(sceneName);
                return;
            }

            if (System.IO.File.Exists(scenePath))
            {
                EditorSceneManager.LoadSceneInPlayMode(scenePath, new LoadSceneParameters(LoadSceneMode.Single));
                return;
            }
#endif
            SceneManager.LoadScene(sceneName);
        }
    }
}
