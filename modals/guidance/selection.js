module.exports = (private_metadata) => {
  return{
    "type": "modal",
    "callback_id":'guidance_selection',
    "private_metadata":private_metadata,
    "title": {
      "type": "plain_text",
      "text": "招待用メッセージを作成する",
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
          "text": "ユーザを指定されたチャンネルに招待するメッセージを生成します。メッセージに含まれるボタンにURLを埋め込むか否か選択してください"
        }
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
								"text": "ボタンにURLを埋め込まない",
								"emoji": true
							},
							"value": "non_url"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "ボタンにURLを埋め込む(クラスルーム招待等に利用できます)",
								"emoji": true
							},
							"value": "with_url"
						}
					],
					"action_id": "guidance_selection"
				}
      ]
      }
    ]
  };
};