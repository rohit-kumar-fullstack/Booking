App Flow (How it works)
<!-- ----------------------------------- -->
Login

User logs in using email and password

Login is dummy-based (no real API or backend)

After successful login, the user is redirected to the Booking screen

<!-- ------------------------------------------ -->

Booking Screen

All created bookings are shown in a list

Each booking card displays:

Customer name

Booking date

Selected service

Cards appear with smooth animations when the screen loads

<!-- --------------------------------------------- -->

Filter Bookings

User can filter bookings based on service type

Example filters:

Hotel

Cab

Resort

Flight

Filter works instantly on the list

<!-- ------------------------------------- -->

Create Booking

A floating “+” button is available on the booking screen

When pressed:

A full-screen modal opens

User enters:

Name

Booking date (using date picker)

Service (dropdown)

All fields are required

Validation is applied and errors are shown with red borders

Save Booking

On submit:

A random unique ID is generated

Booking is saved in Redux

Modal closes automatically

New booking appears instantly in the list

<!-- ------------------------------------- -->

Delete Booking

Each booking card has a trash icon

On pressing it:

Booking is deleted

A success message is shown

List updates immediately

<!-- ----------------------------------------- -->

Pull to Refresh

User can pull down the list to refresh bookings

This simulates reloading data for better UX