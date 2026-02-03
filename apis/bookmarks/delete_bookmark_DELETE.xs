// Delete a bookmark
// Deletes a bookmark by ID for the authenticated user
query "bookmarks/{id}" verb=DELETE {
  api_group = "bookmarks"

  input {
    // Access token for authentication
    text token?
  
    // ID of the bookmark to delete
    int id
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
  
    // Delete the bookmark
    db.del bookmarks {
      field_name = "id"
      field_value = $input.id
    }
  }

  response = {success: true, deleted_id: $input.id}
}