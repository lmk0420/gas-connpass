function main() {
  const properties = getProperties();
  if (!properties) {
    return;
  }
  const DATA_SHEET_BEGIN = 1;
  var sheet = getSheets(properties.SHEET_ID).getSheets()[DATA_SHEET_BEGIN];

  const ROW_HEADER = 1;
  var messageInfos: MessageInfo[] = [];
  sheet
    .getDataRange()
    .getValues()
    .slice(ROW_HEADER)
    .forEach(v => {
      const sheetRow: SheetRow = new SheetRow(
        v[0],
        v[1],
        v[2],
        v[3],
        v[4],
        v.slice(5)
      );

      const query = sheetRow.buildQuery();
      const res = doGetRequest(query);
      if (res.getResponseCode() !== 200) {
        return;
      }

      const connpass: Connpass = JSON.parse(res.getContentText("UTF-8"));
      const messages: string[] = connpass.events.map(event => {
        return `${event.title}\n${event.event_url}`;
      });
      if (messageInfos.length === 0) {
        sheetRow.slackIds.forEach(slackId => {
          messageInfos.push(
            new MessageInfo(slackId, [sheetRow.keyword], messages)
          );
        });
      } else {
        sheetRow.slackIds.forEach(slackId => {
          messageInfos.forEach((messageInfo, i) => {
            if (messageInfo.slackId === slackId) {
              if (messageInfos[i].keywords.indexOf(sheetRow.keyword) === -1) {
                messageInfos[i].keywords.push(sheetRow.keyword);
              }
              messageInfos[i].message.push(
                ...messages.filter(
                  message => messageInfos[i].message.indexOf(message) === -1
                )
              );
            } else {
              messageInfos.push(
                new MessageInfo(slackId, [sheetRow.keyword], messages)
              );
            }
          });
        });
      }
    });

  messageInfos.forEach(messageInfo => {
    const message = `検索ワード：*${messageInfo.keywords.join(
      ", "
    )}*\n\n${messageInfo.message.join(`\n`)}`;
    callSlackWebhook(
      messageInfo.slackId,
      properties.SLACK_WEBHOOK_URL,
      message
    );
  });
}
