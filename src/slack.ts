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
  const blocks = [
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
      }
    }
  ]
  Logger.log(messages);
  
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

  return blocks
}