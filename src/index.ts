function getProperties() {
    const properties = PropertiesService.getScriptProperties()
    const SLACK_ACCESS_TOKEN = properties.getProperty('SLACK_ACCESS_TOKEN')
    const SHEET_ID = properties.getProperty('SHEET_ID')
    return {
        SLACK_ACCESS_TOKEN: SLACK_ACCESS_TOKEN,
        SHEET_ID: SHEET_ID
    }
  }