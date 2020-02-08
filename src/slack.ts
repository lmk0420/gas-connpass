class MessageInfo {
  constructor(
    public slackId: string,
    public keywords: string[],
    public message: string[]
  ) {}
}

function callSlackWebhook(
  slackId: string,
  slackWebhookUrl: string,
  message: string
) {
  const payload = {
    channel: `@${slackId}`,
    text: message,
    link_names: 1
  };
  const res = UrlFetchApp.fetch(slackWebhookUrl, {
    method: "post",
    payload: JSON.stringify(payload)
  });

  return res.getContentText("UTF-8");
}
