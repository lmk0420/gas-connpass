function getProperties() {
  const properties = PropertiesService.getScriptProperties();
  const SLACK_ACCESS_TOKEN = properties.getProperty("SLACK_ACCESS_TOKEN");
  const SHEET_ID = properties.getProperty("SHEET_ID");
  const SLACK_WEBHOOK_URL = properties.getProperty("SLACK_WEBHOOK_URL");

  if (SLACK_ACCESS_TOKEN && SHEET_ID && SLACK_WEBHOOK_URL) {
    return {
      SLACK_ACCESS_TOKEN: SLACK_ACCESS_TOKEN,
      SHEET_ID: SHEET_ID,
      SLACK_WEBHOOK_URL: SLACK_WEBHOOK_URL
    };
  }
  return null;
}
