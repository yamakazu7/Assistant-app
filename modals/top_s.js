/*
学生用のモーダル
*/

module.exports = (private_metadata) => {
  return{
    "type": "modal",
    "private_metadata": private_metadata,
    "callback_id": "function_selection_s",
    "title": {
      "type": "plain_text",
      "text": "Assistant",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "決定",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "キャンセル",
      "emoji": true
    },
    "blocks": [
      {
        "type": "actions",
        "block_id": "function",
        "elements": [
          {
            "type": "radio_buttons",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "ユーザをチャンネルに招待するメッセージを投稿する",
                  "emoji": true
                },
                "value": "g_select"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "メンバーを指定してチャンネルを作る",
                  "emoji": true
                },
                "value": "c_select"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "チャンネル招待用URLを発行する",
                  "emoji": true
                },
                "value": "issue_url"
              }
            ],
            "action_id": "function_selection"
          }
        ]
      }
    ]
  };
};