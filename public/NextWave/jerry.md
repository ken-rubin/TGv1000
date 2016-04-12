
## Review and Recommendations for Ken


- Eliminate dragging
    + Instead, get rid of the 5 surrounding panels (Types, Names, Statements, Literals, Expressions) and, with Method panel open, when I move the cursor around, show me drop targets by highlighting them.
    + If I click on a drop target, open up a panel with only the valid choices for dropping on that target.
    + If, for example, a drop target can take a name and a literal, they should both be in the list, perhaps in two named sections.
    + I then move the pointer into the list and click on my selection. The list closes.
- AI-Al on hover
    + This is a sprite similar to in appearance but a little different in behavior from the comics/help AI. 
    + User can toggle it on or off.
    + As user moves cursor around and pauses for a bit, if it's on, it appears with a bubble containing text that describes what can or should be done.
    + For example, if someone pauses over the word 'statements...' in the while statement, we'll explain, as briefly as possible that this is a location for a block of statements....
    + AI-Al goes away on cursor move, so I don't ever want so much text in the bubble that the user would have to move into the bubble to scroll. The bubble can be drawn to best accomodate the text, but it should contain only what's necessary.
- The comics/help system.
    +  
- Semi-automatic method construction
- Too easy to lose hard-built sets of statements by dragging away the wrong (like the outer) statement or element
- When I drag out an if statement, for example, the then and else should be opened up. When I drag out a while statement, its statements... should be opened up.
- I think we want to auto-save all the time. Then, if someone closes the page or the browser, we're good. Maybe we don't go all the way to the server, but just to LocalStorage.
    + One benefit of this is that, if we do it correctly, we'll have a fairly easy way for the user to resume in exactly the same state as he left.
    + We could also add Ctrl-Z for step-by-step reversals. 



## Questions

- How do I do array.length in a for statement? Obviously, we have to be able to present many of the methods for the natively object-derived Javascript classes. Where will these go?
