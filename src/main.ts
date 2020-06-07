function main() {
  const properties = getProperties();
  if (!properties) return
  const DATA_SHEET_BEGIN = 1;
  const sheet = getSheets(properties.SHEET_ID).getSheets()[DATA_SHEET_BEGIN];

  const ROW_HEADER = 1;

  const messageInfos: MessageInfo[] = [];
  sheet.getDataRange().getValues().slice(ROW_HEADER).forEach(v => {
    const sheetRow: SheetRow = new SheetRow(
      v[0],
      v[1],
      v[2],
      v[3],
      v[4],
      v[5] === 1 ? true : false,
      v.slice(6).filter(e => e !== '')
    );

    const query = sheetRow.buildQuery();
    const res = doGetRequest(query);
    if (res.getResponseCode() !== 200) return;

    const connpass: Connpass = JSON.parse(res.getContentText("UTF-8"));
    const events: Event[] = connpass.events;
    if (messageInfos.length === 0) {
      sheetRow.slackIds.forEach(slackId => {
        messageInfos.push(
          new MessageInfo(slackId, [sheetRow.keyword], events)
        );
      });
    } else {
      sheetRow.slackIds.forEach(slackId => {
        messageInfos.forEach((messageInfo, i) => {
          if (messageInfo.slackId === slackId) {
            if (messageInfos[i].keywords.indexOf(sheetRow.keyword) === -1) {
              messageInfos[i].keywords.push(sheetRow.keyword);
            }
            messageInfos[i].events.push(...events);
          } else {
            messageInfos.push(
              new MessageInfo(slackId, [sheetRow.keyword], events)
            );
          }
        });
      });
    }
  });

  messageInfos.forEach(messageInfo => {
    const title = `検索ワード：${messageInfo.keywords.join(", ")}`;
    const messages = Array.from(new Set(
      messageInfo.events.map(event => `・ <${event.event_url}|${event.title}>`)
    ))
    callSlackWebhook(
      messageInfo.slackId,
      properties.SLACK_WEBHOOK_URL,
      createBlocks(title, messages)
    );
  });
}
