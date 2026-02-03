// Update an existing bookmark
// Updates an existing bookmark by ID for the authenticated user
query "bookmarks/{id}" verb=PUT {
  api_group = "bookmarks"

  input {
    // Access token for authentication
    text token?
  
    // ID of the bookmark to update
    int id
  
    // New category ID (optional)
    int category_id?
  
    // New display title (optional)
    text title? filters=trim
  
    // New URL (optional)
    text url? filters=trim
  
    // New custom icon URL (optional)
    text icon_url? filters=trim
  
    // Icon type: 'favicon', 'custom', 'symbol', or 'generated' (optional)
    text icon_type? filters=trim
  
    // Symbol name identifier e.g. 'star', 'home', 'bookmark' (optional)
    text symbol_name? filters=trim
  
    // Custom color hex code override (e.g. "#f59e0b") (optional)
    text hex_color? filters=trim
  
    // New display order (optional)
    int sort_order?
  }

  stack {
    // Validate the access token and get user
    function.run "bookmarks/validate_token" {
      input = {token: $input.token}
    } as $user
  
    // Get the existing bookmark and verify ownership
    db.query bookmarks {
      where = $db.bookmarks.id == $input.id && $db.bookmarks.user_id == $user.id
      return = {type: "single"}
    } as $existing_bookmark
  
    precondition ($existing_bookmark != null) {
      error_type = "inputerror"
      error = "Bookmark not found"
    }
  
    // If category_id is being changed, verify new category belongs to user
    conditional {
      if ($input.category_id != null) {
        db.query categories {
          where = $db.categories.id == $input.category_id && $db.categories.user_id == $user.id
          return = {type: "single"}
        } as $category
      
        precondition ($category != null) {
          error_type = "inputerror"
          error = "Category not found"
        }
      }
    }
  
    // Build payload with provided fields
    var $payload {
      value = {}
    }
  
    conditional {
      if ($input.category_id != null) {
        var.update $payload.category_id {
          value = $input.category_id
        }
      }
    }
  
    conditional {
      if ($input.title != null) {
        var.update $payload.title {
          value = $input.title
        }
      }
    }
  
    conditional {
      if ($input.url != null) {
        var.update $payload.url {
          value = $input.url
        }
      }
    }
  
    conditional {
      if ($input.icon_url != null) {
        var.update $payload.icon_url {
          value = $input.icon_url
        }
      }
    }
  
    conditional {
      if ($input.icon_type != null) {
        var.update $payload.icon_type {
          value = $input.icon_type
        }
      }
    }
  
    conditional {
      if ($input.symbol_name != null) {
        var.update $payload.symbol_name {
          value = $input.symbol_name
        }
      }
    }
  
    conditional {
      if ($input.hex_color != null) {
        var.update $payload.hex_color {
          value = $input.hex_color
        }
      }
    }
  
    conditional {
      if ($input.sort_order != null) {
        var.update $payload.sort_order {
          value = $input.sort_order
        }
      }
    }
  
    // Update the bookmark
    db.patch bookmarks {
      field_name = "id"
      field_value = $input.id
      data = $payload
    } as $updated_bookmark
  }

  response = $updated_bookmark
}