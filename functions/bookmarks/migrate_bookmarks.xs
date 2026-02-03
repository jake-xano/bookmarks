// One-time migration function to seed initial bookmark data for a user
// Run this once per user, then delete or disable
// Seeds the database with initial categories and bookmarks from the original bookmarks.md file
function "bookmarks/migrate_bookmarks" {
  input {
    // ID of the user to create bookmarks for
    int user_id {
      table = "user"
    }
  }

  stack {
    // Create categories for this user
    db.add categories {
      data = {
        user_id   : $input.user_id
        name      : "Development"
        sort_order: 1
      }
    } as $dev_category
  
    db.add categories {
      data = {
        user_id   : $input.user_id
        name      : "Social & Communication"
        sort_order: 2
      }
    } as $social_category
  
    db.add categories {
      data = {
        user_id   : $input.user_id
        name      : "Tools & CRM"
        sort_order: 3
      }
    } as $tools_category
  
    // Add Development bookmarks
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $dev_category.id
        title      : "Automations"
        url        : "https://xvrs-fsxb-w8c7.n7c.xano.io/admin/workspace/3-0/dashboard"
        sort_order : 1
      }
    } as $bm1
  
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $dev_category.id
        title      : "Dev"
        url        : "https://x62j-rlqn-vpsk.dev.xano.io/workspace/80-0/function"
        sort_order : 2
      }
    } as $bm2
  
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $dev_category.id
        title      : "Docs"
        url        : "https://docs.xano.com/"
        sort_order : 3
      }
    } as $bm3
  
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $dev_category.id
        title      : "Community"
        url        : "https://community.xano.com/"
        sort_order : 4
      }
    } as $bm4
  
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $dev_category.id
        title      : "Gemini"
        url        : "https://gemini.google.com/"
        sort_order : 5
      }
    } as $bm5
  
    // Add Social & Communication bookmarks
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $social_category.id
        title      : "Discord"
        url        : "https://discord.com/channels/1346854103287988265/1401950723536715898"
        sort_order : 1
      }
    } as $bm6
  
    // Add Tools & CRM bookmarks
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $tools_category.id
        title      : "Notion docs"
        url        : "https://www.notion.so/nocodebackend/Jake-Docs-a91edfc1abc04d75bd5f6650235e6a58"
        sort_order : 1
      }
    } as $bm7
  
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $tools_category.id
        title      : "gCal"
        url        : "https://calendar.google.com/calendar/u/0/r"
        sort_order : 2
      }
    } as $bm8
  
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $tools_category.id
        title      : "Hubspot"
        url        : "https://app.hubspot.com/property-settings/23345826/properties?type=0-1"
        sort_order : 3
      }
    } as $bm9
  
    db.add bookmarks {
      data = {
        user_id    : $input.user_id
        category_id: $tools_category.id
        title      : "Intercom"
        url        : "https://app.intercom.com/a/apps/abk6h5qu/settings"
        sort_order : 4
      }
    } as $bm10
  
    var $result {
      value = {
        user_id           : $input.user_id
        categories_created: 3
        bookmarks_created : 10
        message           : "Migration completed successfully for this user."
      }
    }
  }

  response = $result
}