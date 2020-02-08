class SheetRow {
    keyword: string
    ymd?: number
    count?: number
    order?: number
    keywordOr: string
    slackIds: string[]

    constructor(keyword: string, ymd: number, count: number,
        order: string, keywordOr: string, slackIds: string[]) {
        this.keyword = keyword
        this.ymd = ymd
        this.count = count
        switch (order) {
            case "開催日":
                this.order = 1
                break;
            case "更新日": 
                this.order = 2
                break;
            case "新着": 
                this.order = 3
                break;
            default:
                this.order = 1
        } 
        this.keywordOr = keywordOr
        this.slackIds = slackIds
    }
    
    buildQuery(): string {
        const endpoint = "https://connpass.com/api/v1/event/"
        var query = endpoint + "?keyword=" + this.keyword
        if (this.ymd) {
            query += "&ymd=" + this.ymd 
        }
        if (this.count) {
            query += "&count=" + this.count 
        }
        if (this.order) {
            query += "&=order" + this.order 
        }
        if (this.keywordOr) {
            query += "&=keywordor" + this.keywordOr 
        }
        return query;
    }
}

function doGetRequest(url: string) {
    return UrlFetchApp.fetch(url, {
        method: 'get',
        contentType: 'application/json'
    })
}

function getSheets(sheetId: string | null) {
    return sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActive()
}