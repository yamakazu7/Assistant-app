module.exports = (private_metadata) => {
  return{
    "type": "modal",
    "callback_id":'issue_url',
    "private_metadata":private_metadata,
    "title": {
      "type": "plain_text",
      "text": "招待用URLを発行する",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "発行する",
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
        "block_id": "channel",
        "text": {
          "type": "mrkdwn",
          "text": "招待先のチャンネルを指定してください"
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
      }
    ]
  };
};