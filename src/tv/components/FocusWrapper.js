// src/tv/components/FocusWrapper.js
// ✅ النسخة الناجحة سابقاً: إطار خارجي واحد + خلفية شفافة. لا ظلال، لا فلاتر.

import React, { useState, useCallback, memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

const FocusWrapper = memo(({ children, onPress, style, disabled = false, autoFocus = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => { if (!disabled) setIsFocused(true); }, [disabled]);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handlePress = useCallback(() => { if (!disabled && onPress) onPress(); }, [disabled, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      autoFocus={autoFocus}
      focusable={true}
      style={[styles.base, style, isFocused ? styles.focused : styles.unfocused]}
    >
      {children}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: { borderRadius: 16, overflow: 'hidden', borderWidth: 0 },
  unfocused: { borderColor: 'transparent', backgroundColor: 'transparent' },
  focused: { borderColor: '#B861FF', backgroundColor: 'rgba(184, 97, 255, 0.15)', borderWidth: 2 }
});

export default FocusWrapper;