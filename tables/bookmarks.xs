table bookmarks {
  auth = false

  schema {
    // Unique identifier for the bookmark
    int id
  
    // Owner of this bookmark
    int user_id {
      table = "user"
    }
  
    // ID of the category this bookmark belongs to
    int category_id {
      table = "categories"
    }
  
    // Display title of the bookmark
    text title filters=trim
  
    // URL the bookmark points to
    text url filters=trim
  
    // Icon display type: favicon (default), custom, symbol, or generated
    enum icon_type?=favicon {
      value = ["favicon", "custom", "symbol", "generated"]
    }

    // Custom icon URL (used when icon_type is 'custom')
    text icon_url? filters=trim

    // Symbol/icon name for icon libraries (used when icon_type is 'symbol')
    text symbol_name? filters=trim
  
    // Order in which bookmarks are displayed within category
    int sort_order?
  
    // Timestamp when the bookmark was created
    timestamp created_at?=now
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "user_id", op: "asc"}]}
    {type: "btree", field: [{name: "category_id", op: "asc"}]}
    {type: "btree", field: [{name: "sort_order", op: "asc"}]}
  ]
}