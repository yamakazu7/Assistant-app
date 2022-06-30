module.exports = () => {
  return{
    "type": "modal",
    "callback_id":"create_conversation",
    "title": {
      "type": "plain_text",
      "text": "チャンネルのメンバーを管理する",
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
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "作成するチャンネル名とメンバーのリストを渡してください。\nリストは *メールアドレス* か *学籍番号* で構成してください。なお、あなたは自動で参加されます。"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "block_id": "channel_name",
        "element": {
          "type": "plain_text_input",
          "action_id": "plain_text_input_action"
        },
        "label": {
          "type": "plain_text",
          "text": "作成するチャンネル名を入力してください",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "block_id": "format",
        "element": {
          "type": "radio_buttons",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "メールアドレス",
                "emoji": true
              },
              "value": "mail_address"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "学籍番号",
                "emoji": true
              },
              "value": "student_number"
            }
          ],
          "action_id": "radio_buttons_action"
        },
        "label": {
          "type": "plain_text",
          "text": "どちらで指定しますか？",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "block_id": "list",
        "element": {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "plain_text_input_action"
        },
        "label": {
          "type": "plain_text",
          "text": "メンバーを指定してください",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "※入力形式は以下の例に則ってください。\n例:\n0000000000@kindai.ac.jp\n1111111111@kindai.ac.jp\n2222222222@kindai.ac.jp\nまたは\n0000000000\n1111111111\n2222222222"
        }
      }
    ]
  };
};