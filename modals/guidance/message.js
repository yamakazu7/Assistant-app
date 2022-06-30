module.exports = (sender, text, channels) =>{
  return{
    blocks:[
      {
        "type": "section",
        "block_id": "message",
        "text": {
          "type": "plain_text",
          "text": sender,
          "emoji": true
        }
      },
      {
        "type":"section",
        "block_id": "conversations",
        "text": {
          "type": "mrkdwn",
          "text": text
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "参加する",
            "emoji": true
          },
          "value": channels,
          "action_id": "invite_action"
        }
      }
    ]
  };
};