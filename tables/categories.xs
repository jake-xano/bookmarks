table categories {
  auth = false

  schema {
    // Unique identifier for the category
    int id
  
    // Owner of this category
    int user_id {
      table = "user"
    }
  
    // Category name displayed as section header
    text name filters=trim
  
    // Order in which categories are displayed
    int sort_order?
  
    // Timestamp when the category was created
    timestamp created_at?=now
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "user_id", op: "asc"}]}
    {type: "btree", field: [{name: "sort_order", op: "asc"}]}
  ]
}