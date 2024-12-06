function character_is_number_or_underscore_or_ascii_english_letter(character) {
    const code = character.charCodeAt(0); // Get the Unicode value of the character

    // Check if the character is a letter (A-Z or a-z), a digit (0-9), or an underscore (_)
    return (
        (code >= 65 && code <= 90) || // A-Z
        (code >= 97 && code <= 122) || // a-z
        (code >= 48 && code <= 57) ||  // 0-9
        code === 95                     // _
    );
}
console.log(character_is_number_or_underscore_or_ascii_english_letter(`/`));
