module.exports = (private_metadata) => {
  return{
    "type": "modal",
    "callback_id":'kick',
    "private_metadata":private_metadata,
    "title": {
      "type": "plain_text",
      "text": "ユーザーをチャンネルから削除する",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "削除する",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "キャンセル",
      "emoji": true
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "users",
        "element": {
          "type": "multi_users_select",
          "placeholder": {
            "type": "plain_text",
            "text": "ユーザを指定する",
            "emoji": true
          },
          "action_id": "multi_users_select_action"
        },
        "label": {
          "type": "plain_text",
          "text": "現在のチャンネルからユーザを削除します(複数選択可)",
          "emoji": true
        }
      }
    ]
  };
};