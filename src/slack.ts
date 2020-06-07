/**
 * Entity of the message to send in Slack.
 */
class MessageInfo {
  constructor(
    public slackId: string,
    public keywords: string[],
    public events: Event[]
  ) {}
}

/**
 * Send request to Slack webhook.
 * @param slackId slack id
 * @param slackWebhookUrl webhook URL
 * @param blocks blocks
 */
function callSlackWebhook(
  slackId: string,
  slackWebhookUrl: string,
  blocks: any
) {
  const payload = {
    channel: `@${slackId}`,
    // This text is not displayed when using blocks.
    // Used for notification messages instead.
    text: "本日の勉強会情報です :fox_face:", 
    blocks: blocks,
    link_names: 1
  };
  const res = UrlFetchApp.fetch(slackWebhookUrl, {
    method: "post",
    payload: JSON.stringify(payload)
  });

  return res.getContentText("UTF-8");
}

function createBlocks(title: string, messages: string[]) {
  interface Blocks {
    type: string
    text?: Text
    accessory?: Image
  }
  interface Text {
    type: string
    text: string
  }
  interface Image {
    type: string
    image_url: string
    alt_text: string
  }
  const blocks: Blocks[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "本日の勉強会情報です :fox_face:"
      }
    }, 
    {
      type: "divider"
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: title
      },
    }
  ]
  
  messages.forEach(message => blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: message
    }
  }));

  blocks.push({
    type: "divider"
  })

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "今日も一日頑張りましょう!"
    },
    accessory: {
      type: "image",
      image_url: pickImageRandomly(),
      alt_text: "random picture"
    }
  })

  blocks.push({
    type: "divider"
  })
  return blocks
}

// refs: https://pixabay.com/ja/images/search/%E5%8B%95%E7%89%A9/ 
function pickImageRandomly() {
  const images = [
    "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
    "https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_960_720.jpg",
    "https://cdn.pixabay.com/photo/2016/12/05/11/39/fox-1883658_960_720.jpg",
    "https://cdn.pixabay.com/photo/2014/10/01/10/44/hedgehog-468228_960_720.jpg", 
    "https://cdn.pixabay.com/photo/2017/06/09/09/39/adler-2386314_960_720.jpg", 
    "https://cdn.pixabay.com/photo/2014/12/12/19/45/lion-565820_960_720.jpg"

  ]
  return images[Math.round( Math.random () * images.length )]
}