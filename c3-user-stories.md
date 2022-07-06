**Please edit this template and commit to the master branch for your user stories submission.   
Make sure to follow the *Role, Goal, Benefit* framework for the user stories and the *Given/When/Then* framework for the Definitions of Done! You can also refer to the examples DoDs in [C3 spec](https://sites.google.com/view/ubc-cpsc310-21w2-intro-to-se/project/checkpoint-3).

## User Story 1
As a student, I want to add a dataset alongside it's kind at a given id, so that it's data is stored and can be queried.


#### Definitions of Done(s)
Scenario 1: Successfully adds a dataset of either courses or rooms.  
Given: The dataset is a valid dataset of courses or rooms.  
When: The user adds the dataset and provides a valid id and provides the kind correctly.  
Then: A popup with the currently added datasets is shown.

Scenario 2: Unsuccessfully adds a dataset by providing an invalid id.  
Given: The dataset is a valid dataset of courses or rooms.  
When: The user adds the dataset and provides its kind correctly but the id contains an underscore, or is only whitespace characters.  
Then: A popup inform the user that the id is invalid.

Scenario 3: Unsuccessfully adds a dataset of either courses or rooms by proving the wrong kind.  
Given: The dataset is a valid dataset of courses or rooms.  
When: The user adds the dataset with a valid id but provides its kind incorrectly.  
Then: A popup inform the user that an error has occurred.

Scenario 4: Successfully adds a dataset of either courses or rooms when a dataset is already added.  
Given: The dataset is a valid dataset of courses or rooms and there is a dataset added with id "x".  
When: The user adds the dataset and provides its kind correctly, and gives a valid id that is not "x".  
Then: A popup with the currently added datasets is shown.

## User Story 2
As a student, I want to remove a dataset, so that it is no longer accessible in the application.


#### Definitions of Done(s)
Scenario 1: Successfully removes a dataset.  
Given: That the dataset that is being removed has been added.  
When: The user attempts to remove the dataset.  
Then: A popup will tell the user that they successfully removed the given dataset.

Scenario 2: Unsuccessfully removes a dataset.  
Given: That the dataset that is being removed has not been added.  
When: The user attempts to remove the dataset.  
Then: A popup will tell the user that they unsuccessfully removed the given dataset.

## User Story 3
As a student, I want to be able to list datasets, so that I get a basic summary of the datsaets.


#### Definitions of Done(s)
Scenario 1: Lists multiple added datasets.  
Given: That the user has added one or more datasets.  
When: The user tries to list the datasets.  
Then: A popup will list the datasets' id, rows, and kind.

Scenario 2: Lists no added datasets.  
Given: That the user has not added any datasets.  
When: The user tries to list the datasets.  
Then: A popup will return an empty array.

## User Story 4
As a student, I want to send a query, so that I get an JSON result.


#### Definitions of Done(s)
Scenario 1: Valid query  
Given: I send a valid query.  
When: I put the query in a text field.  
Then: The result is shown in another text field.

Scenario 2: Invalid query  
Given: I send an invalid query.  
When: I put the query in a text field.  
Then: A popup shows up and an error message is shown in another text field.

## Others
You may provide any additional user stories + DoDs in this section for general TA feedback.  
Note: These will not be graded.**
