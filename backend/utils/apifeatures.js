class APIFeatures {
    constructor(query,queryStr){
        this.query= query;
        this.queryStr= queryStr;
    }
    search(){ //Search functionlity

        const keyword= this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options:'i'
            }
        }:{}
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){ //filtering by cotegory and price rainge
        const queryCopy = {...this.queryStr};
        //removing feilds from query
        const removeFeilds = ['keyword','limit', 'page'];
        removeFeilds.forEach(el=>delete queryCopy[el]);

        //advance filter for price
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resPerPage){ //creating pagination from backend
        const currentpage= Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentpage -1);
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;