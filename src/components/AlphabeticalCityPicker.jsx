import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ALL_CITIES_A_TO_Z, POPULAR_HUBS, getGroupedCities } from '../data/cityData';
import styles from '../styles/alphabeticalcitypicker.module.css';

const AlphabeticalCityPicker = ({
  label = 'Leaving From',
  value = '',
  onChange,
  opposingValue = '',
  onSameCitySelected,
  icon = '🚌',
  placeholder = 'Select city',
  theme = 'light',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const mainInputRef = useRef(null);
  const listBodyRef = useRef(null);
  const sectionRefs = useRef({});

  // Synchronize search query when value changes from outside (e.g., swap or popular route click)
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dynamic popover positioning to prevent bottom viewport cutting
  const [popoverStyle, setPopoverStyle] = useState({});

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updatePosition = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // If space below is limited (< 310px) and there's more room above, open upwards
        if (spaceBelow < 310 && spaceAbove > spaceBelow) {
          const maxHeight = Math.min(320, Math.max(180, spaceAbove - 20));
          setPopoverStyle({
            top: 'auto',
            bottom: 'calc(100% + 8px)',
            maxHeight: `${maxHeight}px`,
          });
        } else {
          const maxHeight = Math.min(310, Math.max(180, spaceBelow - 20));
          setPopoverStyle({
            top: 'calc(100% + 8px)',
            bottom: 'auto',
            maxHeight: `${maxHeight}px`,
          });
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isOpen]);

  // Filter and group cities based on typed query
  const effectiveQuery = searchQuery || '';
  const groupedCities = useMemo(() => {
    return getGroupedCities(effectiveQuery);
  }, [effectiveQuery]);

  const activeLetters = useMemo(() => {
    return Object.keys(groupedCities).sort();
  }, [groupedCities]);

  // Find state of currently selected city
  const selectedCityObj = useMemo(() => {
    if (!value) return null;
    return ALL_CITIES_A_TO_Z.find(
      (c) => c.city.toLowerCase() === value.trim().toLowerCase()
    );
  }, [value]);

  // Total count of filtered cities
  const totalFilteredCount = useMemo(() => {
    return Object.values(groupedCities).reduce((acc, list) => acc + list.length, 0);
  }, [groupedCities]);

  // Smooth scroll to specific letter section
  const handleLetterJump = (letter, e) => {
    e.stopPropagation();
    const targetElement = sectionRefs.current[letter];
    if (targetElement && listBodyRef.current) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCity = (cityName) => {
    // Check if user selected the same city as the opposing field
    if (opposingValue && cityName.toLowerCase() === opposingValue.trim().toLowerCase()) {
      if (onSameCitySelected) {
        onSameCitySelected(cityName);
      }
    }
    onChange(cityName);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setSearchQuery(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
    mainInputRef.current?.focus();
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's an exact or first match, select it
      const firstLetter = activeLetters[0];
      if (firstLetter && groupedCities[firstLetter]?.length > 0) {
        handleSelectCity(groupedCities[firstLetter][0].city);
      }
    } else if (e.key === 'ArrowDown') {
      if (!isOpen) setIsOpen(true);
    }
  };

  const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div
      className={`${styles.pickerContainer} ${isOpen ? styles.pickerContainerOpen : ''} ${
        theme === 'dark' ? styles.themeDark : styles.themeLight
      }`}
      ref={containerRef}
    >
      {/* Trigger Box with Direct Input */}
      <div
        className={`${styles.triggerBox} ${isOpen ? styles.triggerBoxActive : ''}`}
        onClick={() => {
          mainInputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        <div className={styles.triggerContent}>
          <span className={styles.triggerIcon} role="img" aria-hidden="true">{icon}</span>
          <div className={styles.triggerTextGroup}>
            <input
              ref={mainInputRef}
              type="text"
              className={styles.triggerInput}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDownInput}
              autoComplete="off"
              spellCheck="false"
              aria-label={label}
            />
            {selectedCityObj && !isOpen && (
              <span className={styles.triggerState}>{selectedCityObj.state}</span>
            )}
          </div>
        </div>

        <div className={styles.triggerActions}>
          {value && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              title="Clear selection"
              aria-label="Clear selection"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            className={`${styles.chevronBtn} ${isOpen ? styles.chevronOpen : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
              if (!isOpen) mainInputRef.current?.focus();
            }}
            aria-label="Toggle city dropdown"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className={styles.dropdownPopover} style={popoverStyle}>
          {/* Sticky Header with Search & Alphabet Rail */}
          <div className={styles.stickyHeader}>
            {/* Real-time search inside dropdown */}
            <div className={styles.searchBarWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.stickySearchInput}
                placeholder="Type to filter A-Z Indian cities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onChange(e.target.value);
                }}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => {
                    setSearchQuery('');
                    onChange('');
                  }}
                  title="Clear search filter"
                >
                  ✕
                </button>
              )}
            </div>

            {/* A-Z Quick Jump Alphabet Rail */}
            <div className={styles.alphabetRail}>
              {ALL_LETTERS.map((letter) => {
                const isAvailable = activeLetters.includes(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    className={`${styles.alphabetPill} ${
                      !isAvailable ? styles.alphabetPillDisabled : ''
                    }`}
                    onClick={(e) => isAvailable && handleLetterJump(letter, e)}
                    title={`Jump to letter ${letter}`}
                    disabled={!isAvailable}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Popular Hubs Row */}
            {!searchQuery && (
              <div className={styles.popularHubsRow}>
                <span className={styles.hubTagTitle}>🔥 Top:</span>
                {POPULAR_HUBS.map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    className={styles.hubChip}
                    onClick={() => handleSelectCity(hub)}
                  >
                    {hub}
                  </button>
                ))}
              </div>
            )}

            {/* Match Counter Header */}
            <div className={styles.resultsInfoRow}>
              <span>
                {searchQuery
                  ? `${totalFilteredCount} matching Indian cities (A-Z)`
                  : 'All Indian Cities (A to Z Grouped)'}
              </span>
              {searchQuery && (
                <button
                  type="button"
                  className={styles.resetFilterBtn}
                  onClick={() => {
                    setSearchQuery('');
                    onChange('');
                  }}
                >
                  Show All A-Z
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Grouped Cities Body */}
          <div className={styles.citiesScrollBody} ref={listBodyRef}>
            {activeLetters.length > 0 ? (
              activeLetters.map((letter) => (
                <div
                  key={letter}
                  ref={(el) => (sectionRefs.current[letter] = el)}
                  className={styles.letterGroupSection}
                >
                  {/* Letter Header */}
                  <div className={styles.letterHeader}>
                    <span className={styles.letterLetter}>{letter}</span>
                    <span className={styles.letterBadgeCount}>
                      {groupedCities[letter].length}{' '}
                      {groupedCities[letter].length === 1 ? 'city' : 'cities'}
                    </span>
                  </div>

                  {/* Cities under this letter */}
                  {groupedCities[letter].map((item) => {
                    const isSelected =
                      value && value.toLowerCase() === item.city.toLowerCase();
                    const isOpposing =
                      opposingValue &&
                      opposingValue.toLowerCase() === item.city.toLowerCase();

                    return (
                      <div
                        key={item.city}
                        className={`${styles.cityItemRow} ${
                          isSelected ? styles.cityItemRowSelected : ''
                        }`}
                        onClick={() => handleSelectCity(item.city)}
                        role="button"
                        tabIndex={0}
                        title={`${item.city}, ${item.state}`}
                      >
                        <div className={styles.cityLeft}>
                          <span className={styles.cityBulletIcon} role="img" aria-hidden="true">📍</span>
                          <div className={styles.cityItemText}>
                            <span className={styles.cityItemName}>{item.city}</span>
                            <span className={styles.cityItemState}>{item.state}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className={styles.selectedCityBadge}>Selected</span>
                        )}
                        {isOpposing && (
                          <span className={styles.opposingCityBadge}>Opposite City</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className={styles.noCitiesBox}>
                <span className={styles.noCitiesIcon}>🏙️</span>
                <span className={styles.noCitiesText}>
                  No cities found matching "{searchQuery}"
                </span>
                <button
                  type="button"
                  className={styles.browseAllBtn}
                  onClick={() => {
                    setSearchQuery('');
                    onChange('');
                  }}
                >
                  Browse Full A-Z Indian Cities
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphabeticalCityPicker;
