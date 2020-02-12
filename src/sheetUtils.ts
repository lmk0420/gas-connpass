/**
 * Entity of sheet row.
 */
class SheetRow {
  keyword: string;
  ymd?: number;
  count?: number;
  order?: number;
  otherKeyword: string;
  slackIds: string[];

  constructor(
    keyword: string,
    ymd: number,
    count: number,
    order: string,
    otherKeyword: string,
    slackIds: string[]
  ) {
    this.keyword = keyword;
    this.ymd = ymd;
    this.count = count;
    switch (order) {
      case "開催日":
        this.order = 1;
        break;
      case "更新日":
        this.order = 2;
        break;
      case "新着":
        this.order = 3;
        break;
      default:
        this.order = 1;
    }
    this.otherKeyword = otherKeyword;
    this.slackIds = slackIds;
  }

  /**
   * Generate query to access Connnpass API.
   */
  buildQuery(): string {
    const endpoint = "https://connpass.com/api/v1/event/";
    var query = endpoint + "?keyword=" + this.keyword;

    if (this.otherKeyword) {
      query += "," + this.otherKeyword;
    }
    if (this.ymd) {
      query += "&ymd=" + this.ymd;
    }
    if (this.count) {
      query += "&count=" + this.count;
    }
    if (this.order) {
      query += "&=order" + this.order;
    }

    return query;
  }
}

/**
 * Do GET Request.
 * @param url URL
 */
function doGetRequest(url: string) {
  return UrlFetchApp.fetch(url, {
    method: "get",
    contentType: "application/json"
  });
}

/**
 * Get SpreadSheet.
 * Returns the sheet corresponding to the sheetId, Returns active sheet when sheetId is null.
 * @param sheetId sheet id
 */
function getSheets(sheetId: string | null) {
  return sheetId
    ? SpreadsheetApp.openById(sheetId)
    : SpreadsheetApp.getActive();
}
