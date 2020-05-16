class QueryFilters {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const filterQueryObj = { ...this.queryObj };
    const excludedProps = ['fields', 'page', 'limit', 'sort'];
    excludedProps.forEach((prop) => delete filterQueryObj[prop]);

    let queryStr = JSON.stringify(filterQueryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  selectFields() {
    const fields = this.queryObj.fields ? this.queryObj.fields.split(',').join(' ') : '-__v';
    this.query = this.query.select(fields);

    return this;
  }

  sort() {
    const sortStrings = this.queryObj.sort ? this.queryObj.sort.split(',').join(' ') : '-createdAt';
    this.query = this.query.sort(sortStrings);

    return this;
  }

  paginate() {
    const page = Number(this.queryObj.page) || 1;
    const limit = Number(this.queryObj.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = QueryFilters;
