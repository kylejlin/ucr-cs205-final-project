Andy Jarean, Kyle Lin

# AI Usage

## Tools Used:
- Claude
- Google Antigravity
- Gemini

## How did they help?
Antigravity was helpful in generating code for the project. It was able to understand the entire codebase and generate code that was consistent with the existing code (given that you prompted it carefully). The summary it gave after it finished its changes gave me a good idea of what to expect when reviewing the code manually. 

As for Claude and Gemini, we mainly used them to plan out features and optimize our prompts for Antigravity, after giving it context from the README. Since Antigravity is a strong tool, we wanted to be careful with how it generated code because being too reckless with our prompts could lead to it making large changes that would be difficult to undo, or introduce significant technical debt. An example workflow was first iterating with Claude or Gemini about a feature I wanted to add, then asking the LLM for a prompt that clearly tells Antigravity what to add, how to add it, and any restrictions. Then, we would paste this prompt into Antigravity, waited for it to finish, and review the changes. If we were not satisfied with the changes, we would go back to the browser LLM and ask it for a revised prompt, or a second prompt to fix what went wrong (though if the fix was trivial, a few words sufficed). This was quite efficient, but I believe it was only made possible because the browser LLM understood the codebase well from the README. Had the project not been well-documented, I believe we would have had to spend more time iterating with the browser LLM to get it up to speed.  

## Issues we ran into
For the most part, because we were so careful with our prompting, we rarely ran into issues. Because this is a group project, when one group member would make changes, we would have to make sure that the other group member's browser LLM was also aware of the changes. When one member added the JP locale, the other member's browser LLM was not aware of this when making a prompt, and it wrote a prompt that failed to account for this. This resulted in certain text in the UI being hardcoded to English. Another relatively minor issue was with implementing the Doom easter egg. Because we didn't want the project to explode in scope for a minor feature, we had to make sure Antigravity didn't install any npm packages or introduce any new dependencies. Ocassionally, when iterating with Gemini, it would give us broken or outdated links to the game, which we manually fixed.