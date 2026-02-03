addon category_bookmarks {
  input {
    int category_id? {
      table = "categories"
    }
  
    int user_id? {
      table = "user"
    }
  }

  stack {
    db.query bookmarks {
      where = $db.bookmarks.category_id == $input.category_id && $db.bookmarks.user_id == $input.user_id
      sort = {bookmarks.sort_order: "asc"}
      return = {type: "list"}
    }
  }
}