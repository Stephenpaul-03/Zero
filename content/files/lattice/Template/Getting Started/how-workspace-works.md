# How a Workspace Works

A workspace is the combination of a subject definition, a sidebar, and a content directory.

## Subject definition

The subject list gives a workspace an ID, a display label, and the URL of its sidebar JSON file. The ID becomes part of the route, such as `Template-home`.

## Sidebar definition

The sidebar JSON describes the overview label and the categories and topics that appear in the navigation. Topic paths become lesson routes and file lookup paths.

## Content directory

Markdown lives under `public/content/<subject-id>`. Category folders mirror the category titles in the sidebar so the app can resolve each lesson without a database.
