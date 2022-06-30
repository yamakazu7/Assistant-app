const { App } = require("@slack/bolt");
const fs = require("fs");
require("date-utils");

const top = require("./modals/top");
const top_s = require("./modals/top_s");
const g_select = require("./modals/guidance/selection");
const c_select = require("./modals/conversation/selection");
const guide = require("./modals/guidance/make");
const guide_url = require("./modals/guidance/make_url");
const message = require("./modals/guidance/message");
const message_url = require("./modals/guidance/message_url");
const kick = require("./modals/kick_user");
const create = require("./modals/conversation/create");
const update = require("./modals/conversation/update");
const issue = require("./modals/issue_url");

/*
 *インスタンスの生成
 *AppコンストラクタはBot User OAuth Access TokenとSigning Secretの2つが要る
 *ここでは環境変数から取得している
 */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

//サーバの起動
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("Bolt app is running!");
})();

//以下，大枠の機能ごとに枠線で仕切る
//--------------------------------------------------------------------------------------------------------------------------------------------------

// "/assistant"コマンドが実行された際呼び出される
app.command("/assistant", async ({ ack, body, client }) => {
  //現チャンネルのIDを取得しておく
  const private_metadata = body.channel_id;
  
  // user_nameを取得してJSONから文字列に変換
  let user_name = JSON.stringify(body.user_name);
  
  // user_nameの桁数を取得
  const leng = user_name.length;
  
  // 確認用にコンソールにuser_nameとその文字数を表示
  console.log(user_name);
  console.log(leng);

  // 学生か教員のどちらかであるかを判断
  // 学生の場合、桁数が"191037xxxx"のように13であること利用
  //if (user_name.indexOf("_s_") == -1) {
   if (leng != 13) {
    
    // 教員用のモーダルのトップ画面を返す
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: top(private_metadata),
      });
      await ack();
      
      // モーダルの起動でエラーが発生した場合
    } catch (error) {
      console.error(error);
      await ack(
        `:x: モーダルの起動でエラーが発生しました (コード:${error.code})`
      );
      let date = new Date();
      const e_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        error.data.error +
        ", command_execution";

      fs.appendFileSync("error_log.csv", e_log, (err) => {
        if (err) throw err;
      });
    }
     
  // 学生の場合、桁数が"191037xxxx"のように13であること利用   
  } else if(leng == 13){
    // 学生用のモーダルのトップ画面を返す
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: top_s(private_metadata),
      });
      await ack();
      
      // モーダルの起動でエラーが発生した場合
    } catch (error) {
      console.error(error);
      await ack(
        `:x: モーダルの起動でエラーが発生しました (コード:${error.code})`
      );
      let date = new Date();
      const e_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        error.data.error +
        ", command_execution";

      fs.appendFileSync("error_log.csv", e_log, (err) => {
        if (err) throw err;
      });
    }
    
    //　どちらにも属さなかった場合
  } else {
    await ack(`このコマンドは学生と教員以外使用できません`);
  }
});


//ユーザの目的が設定された時のアクション
app.action(
  { callback_id: "function_selection" },
  async ({ ack, body, client, context, logger }) => {
    
    //JSONで送られたbodyから値を取得．bodyの内容は見て確認すること
    const selected_function =
      body.view.state.values.function.function_selection.selected_option.value;
    const private_metadata = body.view.private_metadata;

    try {
      switch (selected_function) {
        case "g_select":
          await client.views.update({
            view_id: body.view.id,
            hash: body.view.hash,
            view: g_select(private_metadata),
          });
          break;

        case "kick":
          await client.views.update({
            view_id: body.view.id,
            hash: body.view.hash,
            view: kick(private_metadata),
          });
          break;

        case "c_select":
          await client.views.update({
            view_id: body.view.id,
            hash: body.view.hash,
            view: c_select(),
          });
          break;

        case "issue_url":
          await client.views.update({
            view_id: body.view.id,
            hash: body.view.hash,
            view: issue(private_metadata),
          });
          break;

        default:
          console.log(`Sorry, we are out of ${selected_function}.`);
      }
      await ack();
    } catch (error) {
      console.error(error);
      await ack(
        `:x: モーダルの送信でエラーが発生しました(コード: ${error.code})`
      );
      let date = new Date();
      const e_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        error.data.error +
        ", function_selected";

      fs.appendFileSync("error_log.csv", e_log, (err) => {
        if (err) throw err;
      });
    }
  }
);


//--------------------------------------------------------------------------------------------------------------------------------------------------

//コールバックIDguidance_selectionが送信された際に呼び出されるハンドラ
app.action(
  { callback_id: "guidance_selection" },
  async ({ ack, body, client, context }) => {
    const channel_id = body.view.private_metadata;

    if (body.actions[0].selected_option.value == "non_url") {
      await client.views.update({
        view_id: body.view.id,
        hash: body.view.hash,
        view: guide(channel_id),
      });
    } else {
      await client.views.update({
        view_id: body.view.id,
        hash: body.view.hash,
        view: guide_url(channel_id),
      });
    }
    await ack();
  }
);

//URL埋め込みなしの招待メッセージ発行
app.view("make", async ({ ack, body, client, context, view }) => {
  const channel_id = view.private_metadata;

  const form_data = {
    channels:
      view.state.values.channels.multi_conversations_select_action
        .selected_conversations,
    message: view.state.values.message.plain_text_input_action.value,
  };

  const user_info = await client.users.info({
    token: context.botToken,
    user: body.user.id,
  });

  const post_message = message(
    `<${user_info.user.real_name}>さんからの招待メッセージです`,
    form_data.message,
    JSON.stringify(form_data.channels)
  ).blocks;

  try {
    await client.chat.postMessage({
      channel: channel_id,
      blocks: post_message,
    });
    await ack();
    let date = new Date();
    const h_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      channel_id +
      ", " +
      body.user.id +
      ", make";

    fs.appendFileSync("history.csv", h_log, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.error(error);
    await ack(
      `:x: モーダルの送信でエラーが発生しました(コード: ${error.code})`
    );
    let date = new Date();
    const e_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      error.data.error +
      ", make";

    fs.appendFileSync("error_log.csv", e_log, (err) => {
      if (err) throw err;
    });
  }
});

//URL埋め込みありの招待メッセージ発行
app.view("make_url", async ({ client, context, body, ack, view }) => {
  const channel_id = view.private_metadata;

  const form_data = {
    channels:
      view.state.values.channels.multi_conversations_select_action
        .selected_conversations,
    message: view.state.values.message.plain_text_input_action.value,
    url: view.state.values.url.plain_text_input_action.value,
  };

  const user = await client.users.info({
    token: context.botToken,
    user: body.user.id,
  });

  const post_message = message_url(
    `<@${user.user.real_name}>さんからの招待メッセージです`,
    form_data.message,
    JSON.stringify(form_data.channels),
    form_data.url
  ).blocks;

  try {
    await client.chat.postMessage({
      channel: channel_id,
      blocks: post_message,
    });
    await ack();
    let date = new Date();
    const h_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      channel_id +
      ", " +
      body.user.id +
      ", make_url";

    fs.appendFileSync("history.csv", h_log, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.error(error);
    await ack(
      `:x: モーダルの送信でエラーが発生しました(コード: ${error.code})`
    );
    let date = new Date();
    const e_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      error.data.error +
      ", make_url";

    fs.appendFileSync("error_log.csv", e_log, (err) => {
      if (err) throw err;
    });
  }
});

//guideによって生成されたメッセージの「参加する」ボタンが押された時のハンドラ
app.action("invite_action", async ({ ack, body, context, client, logger }) => {
  //無駄に複雑部分
  const value = JSON.parse(
    body.actions.find((e) => e.action_id === "invite_action").value
  );

  try {
    for (let property in value) {
      await client.conversations.invite({
        token: context.botToken,
        channel: value[property],
        users: body.user.id,
      });
      let date = new Date();
      const h_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        value[property] +
        ", " +
        body.user.id +
        ", invite_action";

      fs.appendFileSync("history.csv", h_log, (err) => {
        if (err) throw err;
      });
    }
  } catch (error) {
    console.error(error);
    let date = new Date();
    const e_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      ", " +
      error.data.error +
      ", invite_action";

    fs.appendFileSync("error_log.csv", e_log, (err) => {
      if (err) throw err;
    });
  }
  await ack();
});

//--------------------------------------------------------------------------------------------------------------------------------------------------

//コールバックIDkickが送信された際に呼び出されるハンドラ
app.view("kick", async ({ ack, body, client, context, view }) => {
  const channel_id = view.private_metadata;
  const users =
    view.state.values.users.multi_users_select_action.selected_users;
  console.log(body);

  try {
    for (let property in users) {
      //ユーザの削除は管理者の権限が必要な場合があるため，ユーザトークンを利用する
      await client.conversations.kick({
        token: process.env.SLACK_USER_TOKEN,
        channel: channel_id,
        user: users[property],
      });
    }
    await ack();
    let date = new Date();
    const h_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      channel_id +
      ", " +
      body.user.id +
      ", kick";

    fs.appendFileSync("history.csv", h_log, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.error(error);
    await ack(
      `:x: モーダルの送信でエラーが発生しました(コード: ${error.code})`
    );
    let date = new Date();
    const e_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      error.data.error +
      ", kick";

    fs.appendFileSync("error_log.csv", e_log, (err) => {
      if (err) throw err;
    });
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------------------

//コールバックIDconversation_selectionが送信された際に呼び出されるハンドラ
app.action(
  { callback_id: "conversation_selection" },
  async ({ ack, body, client, context }) => {
    if (body.actions[0].selected_option.value == "create") {
      await client.views.update({
        view_id: body.view.id,
        hash: body.view.hash,
        view: create(),
      });
    } else {
      await client.views.update({
        view_id: body.view.id,
        hash: body.view.hash,
        view: update(),
      });
    }
    await ack();
  }
);

//チャンネルを作成する場合の処理
app.view(
  "create_conversation",
  async ({ ack, body, client, context, view }) => {
    const form_data = {
      channel_name:
        view.state.values.channel_name.plain_text_input_action.value,
      format:
        view.state.values.format.radio_buttons_action.selected_option.value,
      list: view.state.values.list.plain_text_input_action.value,
    };

    const user_hash = {};
    //取得したリストを配列へ変換
    const obj_key = form_data.list.split("\n");
    //ワークスペースの全ユーザのリストを取得
    const users = await client.users.list({
      token: context.botToken,
    });
    //bot以外のユーザのユーザIDをメールアドレスをキーとして連想配列に格納
    for (let i in users.members) {
      if (users.members[i].is_bot == false) {
        user_hash[users.members[i].profile.email] = users.members[i].id;
      }
    }

    try {
      let usertmp = [];

      if (form_data.format == "mail_address") {
        for (let i in obj_key) {
          //リストのメールアドレスを持つユーザを検索，格納
          let tmp = await client.users.lookupByEmail({
            token: context.botToken,
            email: obj_key[i],
          });
          usertmp.push(tmp.user.id);
        }
        //1人でもいれば処理に入るが，エラーによってはチャンネルの作成だけ行われる恐れがある．作成されたチャンネルの削除は管理者かオーナーにしか行えないため注意
        if (usertmp.length > 0) {
          var c_channel = await client.conversations.create({
            token: context.botToken,
            name: form_data.channel_name,
          });
          usertmp.push(body.user.id);
          await client.conversations.invite({
            token: context.botToken,
            channel: c_channel.channel.id,
            users: usertmp.join(),
          });
        }
      } else {
        //学籍番号が選択された場合，メールアドレスの最初の10桁をキーとして検索する
        for (let key of Object.keys(user_hash)) {
          for (let i of obj_key) {
            if (key.slice(0, 10) == i) {
              usertmp.push(user_hash[key]);
            }
          }
        }

        if (usertmp.length > 0) {
          var c_channel = await client.conversations.create({
            token: context.botToken,
            name: form_data.channel_name,
          });
          usertmp.push(body.user.id);
          await client.conversations.invite({
            token: context.botToken,
            channel: c_channel.channel.id,
            users: usertmp.join(),
          });
        }
      }
      await ack();
      let date = new Date();
      const h_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        c_channel +
        ", " +
        body.user.id +
        ", create_conversation";

      fs.appendFileSync("history.csv", h_log, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      console.error(error.data);
      await ack(
        `:x: モーダルの送信でエラーが発生しました(コード: ${error.code})`
      );
      let date = new Date();
      const e_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        error.data.error +
        ", create_conversation";

      fs.appendFileSync("error_log.csv", e_log, (err) => {
        if (err) throw err;
      });
    }
  }
);

//チャンネルを更新する場合の処理
app.view(
  "update_conversation",
  async ({ client, context, body, ack, view }) => {
    const form_data = {
      channel:
        view.state.values.channel.multi_conversations_select_action
          .selected_conversations,
      format:
        view.state.values.format.radio_buttons_action.selected_option.value,
      list: view.state.values.list.plain_text_input_action.value,
    };

    const ids = [];
    const emails = [];
    const user_hash = {};
    const obj_key = form_data.list.split("\n");
    const users = await client.users.list({
      token: context.botToken,
    });
    for (let i in users.members) {
      if (users.members[i].is_bot == false) {
        ids.push(users.members[i].id);
        emails.push(users.members[i].profile.email);
        user_hash[users.members[i].profile.email] = users.members[i].id;
      }
    }

    try {
      //指定したチャンネルのメンバーを取得する
      let members = await client.conversations.members({
        token: context.botToken,
        channel: form_data.channel[0],
      });

      //チャンネルのメンバーのうち操作中のユーザとアプリ以外をキックする
      for (let i in members.members) {
        if (
          members.members[i] != body.user.id &&
          ids.includes(members.members[i])
        ) {
          await client.conversations.kick({
            token: process.env.SLACK_USER_TOKEN,
            channel: form_data.channel[0],
            user: members.members[i],
          });
        }
      }

      //メールアドレスが選択されていた時の処理
      if (form_data.format == "mail_address") {
        let user = "";
        for (let i in obj_key) {
          user = await client.users.lookupByEmail({
            token: context.botToken,
            email: obj_key[i],
          });
          if (user.user.id != body.user.id) {
            await client.conversations.invite({
              token: context.botToken,
              channel: form_data.channel[0],
              users: user.user.id,
            });
          }
        }
      } else {
        for (let key of Object.keys(user_hash)) {
          for (let i of obj_key) {
            if (key.slice(0, 10) == i && user_hash[key] != body.user.id) {
              await client.conversations.invite({
                token: context.botToken,
                channel: form_data.channel[0],
                users: user_hash[key],
              });
            }
          }
        }
      }
      await ack();
      let date = new Date();
      const h_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        form_data.channel[0] +
        ", " +
        body.user.id +
        ", update_conversation";

      fs.appendFileSync("history.csv", h_log, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      console.error(error);
      await ack(
        `:x: モーダルの送信でエラーが発生しました(コード: ${error.code})`
      );
      let date = new Date();
      const e_log =
        "\n" +
        date.toFormat("YYYY/MM/DD") +
        ", " +
        date.toFormat("HH24:MI:SS") +
        "+09:00:00, " +
        error.data.error +
        ", update_conversation";

      fs.appendFileSync("error_log.csv", e_log, (err) => {
        if (err) throw err;
      });
    }
  }
);

//--------------------------------------------------------------------------------------------------------------------------------------------------

app.view("issue_url", async ({ client, context, body, ack, view }) => {
  const channel_id = view.private_metadata;
  const form_data = {
    channel:
      view.state.values.channel.multi_conversations_select_action
        .selected_conversations,
  };

  const user = await client.users.info({
    token: context.botToken,
    user: body.user.id,
  });

  const channel_info = await client.conversations.info({
    channel: form_data.channel[0],
  });

  const post_message = message(
    `<${user.user.real_name}>さんから<＃${channel_info.channel.name}>への招待です`,
    "ボタンをクリック(タップ)して参加してください",
    JSON.stringify(form_data.channel)
  ).blocks;

  try {
    //招待メッセージ投稿先チャンネルのIDを指定する．IDは環境変数で指定
    const message = await client.chat.postMessage({
      channel: process.env.BULLETIN_BOARD,
      blocks: post_message,
    });

    const url = await client.chat.getPermalink({
      channel: process.env.BULLETIN_BOARD,
      message_ts: message.ts,
    });

    await client.chat.postEphemeral({
      channel: channel_id,
      user: body.user.id,
      text: `URLを発行しました。\n ${url.permalink}`,
    });
    await ack();
    let date = new Date();
    const h_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      channel_id +
      ", " +
      body.user.id +
      ", issue_url";

    fs.appendFileSync("history.csv", h_log, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.error(error);
    await ack(
      `:x: モーダルの送信でエラーが発生しました(コード: ${error.code})`
    );
    let date = new Date();
    const e_log =
      "\n" +
      date.toFormat("YYYY/MM/DD") +
      ", " +
      date.toFormat("HH24:MI:SS") +
      "+09:00:00, " +
      error.data.error +
      ", issue_url";

    fs.appendFileSync("error_log.csv", e_log, (err) => {
      if (err) throw err;
    });
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------------------

app.event("reaction_added", async ({ ack, body, client, context, message }) => {
  //      let date = new Date();
  //     const e_log = '\n' + date.toFormat('YYYY/MM/DD') + ', ' + date.toFormat('HH24:MI:SS') + '+09:00:00, ' + body.team_id + ', guide_c';
  //     fs.appendFileSync("error_log.csv", e_log, (err) => {
  //       if (err) throw err;
  //     });
  //     const h_log = '\n' + date.toFormat('YYYY/MM/DD') + ', ' + date.toFormat('HH24:MI:SS') + '+09:00:00, ' + body.team_id+ ', ' + body.team_id + ', issue_url';
  //     fs.appendFileSync("history.csv", h_log, (err) => {
  //       if (err) throw err;
  //     });
  //   console.log("a");
  // let members = await client.conversations.members({
  //     token: context.botToken,
  //     channel: "G01797716SF"
  //   });
  // console.log(members);
  // let text = fs.readFileSync("text.txt", 'utf-8');
  // let tmp = text.split('\n');
  // tmp.unshift('W015NPMUR6E');
  // let array = [];
  // for(let i in tmp){
  //    if(!array.includes(tmp[i])){
  //   await client.chat.postMessage({
  //     channel: tmp[i],
  //     text: "上記のフォームは近大のアカウントからアクセスしてください。"
  //   });
  //     array.push(tmp[i]);
  //   }
  // }
  //   console.log(array.length);
});

//--------------------------------------------------------------------------------------------------------------------------------------------------

/* ここまでがモーダルの表示、内部処理のコードである。
   以下よりInteractice Componentsを用いた対話式機能を実装する
*/

//--------------------------------------------------------------------------------------------------------------------------------------------------

// app_home_openedのイベント処理


 /* app.event("app_home_opened", ({ event, say }) => {
   
  say(`こんにちは!! ,<@${event.user}>\n ` + "Slackのチャンネル運用支援等を目的として知的通信網研究室で運用しているアプリAssistantです。\n学内Slackにおけるチャンネル招待やユーザ管理機能を使うことができます。\n" 
  + "ご利用の際は、DMで「機能一覧」と送信していただくとDM上に操作ボタンが表示されます。\nまたは、「/assistant」と入力し送信頂くことで、モーダルが表示されます。" 
  + "ぜひ、ご活用ください!!!!!");
}); */

//--------------------------------------------------------------------------------------------------------------------------------------------------

//アクションリクエストの確認
app.action({ callback_id: "make" }, async ({ ack, payload }) => {
  await ack();
});

app.action({ callback_id: "make_url" }, async ({ ack }) => {
  await ack();
});

app.action({ callback_id: "kick" }, async ({ ack }) => {
  await ack();
});

app.action({ callback_id: "create_conversation" }, async ({ ack }) => {
  await ack();
});

app.action({ callback_id: "update_conversation" }, async ({ ack }) => {
  await ack();
});

app.action({ callback_id: "issue_url" }, async ({ ack }) => {
  await ack();
});

//グローバルエラーが発生した際呼び出される関数
app.error(async (error) => {
  console.error(error);
  let date = new Date();
  const e_log =
    "\n" +
    date.toFormat("YYYY/MM/DD") +
    ", " +
    date.toFormat("HH24:MI:SS") +
    ", " +
    error.data.error +
    ", global";

  fs.appendFileSync("error_log.csv", e_log, (err) => {
    if (err) throw err;
  });
});
