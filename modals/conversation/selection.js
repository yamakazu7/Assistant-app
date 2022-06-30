module.exports = () => {
  return{
    "type": "modal",
    "callback_id":"conversation_selection",
    "title": {
      "type": "plain_text",
      "text": "チャンネルを作成・再構成する",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "送信",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "キャンセル",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "特定のメンバーのリストを渡すことで、そのメンバーで構成されるチャンネルを作成できます。"
        }
      },
      {
        "type": "divider"
      },
      {
			"type": "actions",
			"elements": [
				{
					"type": "radio_buttons",
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "新しくチャンネルを作成する",
								"emoji": true
							},
							"value": "create"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "既存のチャンネルを選ぶ",
								"emoji": true
							},
							"value": "update"
						}
					],
					"action_id": "conversation_selection"
				}
			]
		}
    ]
  };
};