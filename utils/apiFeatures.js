class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1a) filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((elem) => delete queryObj[elem]);

    //1b)advance filtering
    let queryStr = JSON.stringify(queryObj);
    //regex means => replace gte,gt,lte,lt with $gte, $gt, $lte, $lt (/g <= means all of results and not only first)
    queryStr = queryStr.replace(/(gte|gt|lte|lt\b)/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //2) sorting
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      //sort("price ratingAvarage")
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //3) field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      //exclude v from data
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //skip = how many to skip and from where to start count
    //limit = how many to show, what is the content limit

    //page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    //so user requested 3rd page that means skip limit must me 20
    //so page number(3 as mentioned above) = last page(3 - 1) * 10(limit)
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
