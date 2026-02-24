using UnityEngine;
using UnityEngine.UI;

namespace CharacterMapRPG.BattleCore
{
    public sealed class EncounterLaunchButton : MonoBehaviour
    {
        [SerializeField] private string encounterId = "r1m1";
        [SerializeField] private Text labelText;
        [SerializeField] private Button button;

        private MapSceneController _controller;

        public string EncounterId => encounterId;

        public void SetEncounterId(string value)
        {
            encounterId = value;
        }

        public void Bind(MapSceneController controller, string displayName)
        {
            _controller = controller;
            if (!button) button = GetComponent<Button>();
            if (!labelText) labelText = GetComponentInChildren<Text>();
            if (labelText) labelText.text = displayName;

            if (button)
            {
                button.onClick.RemoveListener(OnClicked);
                button.onClick.AddListener(OnClicked);
            }
        }

        private void OnClicked()
        {
            AudioManager.Instance?.PlayUiClick();
            _controller?.StartEncounterById(encounterId);
        }
    }
}
