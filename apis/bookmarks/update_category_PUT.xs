// Update an existing category
// Updates an existing category by ID for the authenticated user
query "categories/{id}" verb=PUT {
  api_group = "bookmarks"

  input {
    // Access token for authentication
    text token?
  
    // ID of the category to update
    int id
  
    // New category name (optional)
    text name? filters=trim
  
    // New display order (optional)
    int sort_order?
  
    // Hex color for category accent (optional)
    text hex_color? filters=trim
  }

  stack {
    // Validate the access token and get user
    function.run "bookmarks/validate_token" {
      input = {token: $input.token}
    } as $user
  
    // Get the existing category and verify ownership
    db.query categories {
      where = $db.categories.id == $input.id && $db.categories.user_id == $user.id
      return = {type: "single"}
    } as $existing_category
  
    precondition ($existing_category != null) {
      error_type = "inputerror"
      error = "Category not found"
    }
  
    // Build payload with provided fields
    var $payload {
      value = {}
    }
  
    conditional {
      if ($input.name != null) {
        var.update $payload.name {
          value = $input.name
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
  
    conditional {
      if ($input.hex_color != null) {
        var.update $payload.hex_color {
          value = $input.hex_color
        }
      }
    }
  
    // Update the category
    db.patch categories {
      field_name = "id"
      field_value = $input.id
      data = $payload
    } as $updated_category
  }

  response = $updated_category
}