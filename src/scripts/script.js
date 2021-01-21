const spellList_$ = $('#spell-list')

let allSpells = []
let filteredSpells = []

const filters = {
    searchTerm: '',
    selectedClass: null,
    cantrip: true,
    first: true,
    second: true,
    third: true,
    fourth: true,
    fifth: true,
    sixth: true,
    seventh: true,
    eighth: true,
    ninth: true,
}

getSpells().then((response) => {
    allSpells = response
    filteredSpells = allSpells
    renderPage()
})

function renderPage() {
    displaySpells()
    displayFilters()
}

function displayFilters() {
    const levelFilters_$ = $('#level-filters')
    levelFilters_$.empty()

    // Level Filters
    for (let i = 0; i <= 9; i++) {
        createFilterBTN(i, levelFilters_$)
    }

    if (!allFiltersAre(true)) {
        createFilterBTN('reset level', levelFilters_$)
    }
    // Class Filters
    const classFilters_$ = $('#class-filters')
    classFilters_$.empty()

    for (let i = 0; i < allClasses.length; i++) {
        createFilterBTN(capitalize(allClasses[i]), classFilters_$)
    }

    if (filters.selectedClass !== null) {
        createFilterBTN('reset class', classFilters_$)
    }
}

function displaySpells() {
    spellList_$.empty()
    let levelDisplay = -1
    let spell
    for (let i = 0; i < allSpells.length; i++) {
        spell = allSpells[i]

        if (!shouldDisplaySpell(spell)) {
            continue
        }

        if (spell.level !== levelDisplay &&
            filters.searchTerm === '') {
            levelDisplay = spell.level
            createSpellSeparator(levelDisplay, spellList_$)
        }

        const spell_$ = createSpellEl(spell, i)
        spellList_$.append(spell_$)
    }
}

/********************************************************************* */
// DOM Manipulation
/********************************************************************* */
function createSpellEl(spell, index) {
    const spell_$ = $(`
    <div spell-index="${index}">
        <p>${spell.name}</p>
    </div>
    `)

    return spell_$
}


function createFilterBTN(text, parentDiv) {
    let styles = ''
    if (typeof text === 'string' && text.toLowerCase() === filters.selectedClass) {
        styles = 'selected-class'
    }
    const button = $(`
        <button type="button" class="${styles}">${text}</button>
    `)
    parentDiv.append(button)
}

function createSpellSeparator(level, parentDiv) {
    let levelText = capitalize(allLevels[level])
    if (levelText !== 'Cantrip') {
        levelText += ' Level Spell'
    }
    const separator = $(`
        <p>${levelText}</p>
        <hr>
    `)

    parentDiv.append(separator)
}
/********************************************************************* */
// Event Listeners
/********************************************************************* */
$('#level-filters').on('click', 'button', function() {
    const textBTN = $(this).text()

    if (textBTN === 'reset level') {
        setAllFilters(true)
    } else {
        if (allFiltersAre(true)) {
            setAllFilters(false)
        } 
        
        filters[allLevels[textBTN]] = !filters[allLevels[textBTN]]
        
        if (allFiltersAre(false)) {
            setAllFilters(true)
        }
    }
    
    renderPage()
})

$('#class-filters').on('click', 'button', function() {
    const textBTN = $(this).text().toLowerCase()
    console.log(textBTN)

    if (textBTN === 'reset class' || 
        textBTN === filters.selectedClass) {
        filters.selectedClass = null
    } else {
        filters.selectedClass = textBTN
    }
    renderPage()
})

$('#search-input').on('keyup', function(event) {
    filters.searchTerm = $(this).val()
    console.log(filters.searchTerm)
    displaySpells()
})

$('#spell-list').on('click', 'div', function(event) {

})
/********************************************************************* */
// Utils
/********************************************************************* */
function capitalize(str) {
    let arr = str.split(' ')
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i][0].toUpperCase() + arr[i].substring(1)
    }
    return arr.join(' ')
}

function allFiltersAre(bool) {
    let filterArr = allLevels

    let allSame = true
    for (let i = 0; i < filterArr.length; i++) {
        if (filters[filterArr[i]] !== bool) {
            allSame = false
            break
        }
    }
    return allSame
}

function setAllFilters(bool) {
    let filterArr = allLevels

    for (let i = 0; i < filterArr.length; i++) {
        filters[filterArr[i]] = bool
    }
}

const allLevels = [
    'cantrip',
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
]
const allClasses = [
    'wizard',
    'sorcerer',
    'cleric',
    'paladin',
    'ranger',
    'bard',
    'druid',
    'warlock',
]

function shouldDisplaySpell(spell) {
    let shouldDisplay = false

    // Filter on Class
    let matchesClass = true
    const classes = spell.classes.map((el) => el.index)

    if (filters.selectedClass !== null && !classes.includes(filters.selectedClass)) {
        matchesClass = false
    }

    if (!matchesClass) return false

    // Filter on Level
    let matchesLevel = false

    for (let i = 0; i < allLevels.length; i++) {
        if (filters[allLevels[i]] && spell.level === i) {
            matchesLevel = true
            break
        }
    }

    if (!matchesLevel) return false

    // Filters on Search Term
    let matchesTerm = true

    if (filters.searchTerm !== '' &&
        !spell.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        matchesTerm = false
    }

    shouldDisplay = matchesClass && matchesLevel && matchesTerm
    return shouldDisplay
}
