module.exports = (private_metadata) => {
  return{
    "type": "modal",
    "callback_id":'make',
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
          "text": "こんにちは！このbotユーザを指定されたチャンネルに招待するメッセージを生成します。メッセージは現在開いているチャンネルで投稿されます。"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "block_id": "channels",
        "text": {
          "type": "mrkdwn",
          "text": "*招待したいチャンネルを指定してください(複数可)*"
        },
        "accessory": {
          "type": "multi_conversations_select",
          "placeholder": {
            "type": "plain_text",
            "text": "チャンネルを指定する",
            "emoji": true
          },
          "action_id": "multi_conversations_select_action"
        }
      },
      {
        "type": "input",
        "block_id":"message",
        "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "plain_text_input_action"
        },
        "label": {
          "type": "plain_text",
          "text": "投稿するメッセージを入力してください",
          "emoji": true
        }
      }
    ]
  };
};