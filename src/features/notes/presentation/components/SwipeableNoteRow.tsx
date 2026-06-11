import React, { useMemo } from 'react';
import { Animated, PanResponder, StyleSheet, View, Dimensions } from 'react-native';
import { AppText } from '../../../../core/design-system';
import { colors } from '../../../../core/theme';
import { NoteListItem } from './NoteListItem';
import type { Note } from '../../domain/entities';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ACTION_WIDTH = 80;

interface SwipeableNoteRowProps {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress?: (note: Note) => void;
  onSwipeArchive: (note: Note) => void;
  onSwipeDelete: (note: Note) => void;
}

/**
 * Note row with swipe actions.
 * Swipe left reveals Archive, swipe right reveals Delete.
 * Uses built-in PanResponder + Animated — no gesture library.
 */
export function SwipeableNoteRow({
  note,
  onPress,
  onLongPress,
  onSwipeArchive,
  onSwipeDelete,
}: SwipeableNoteRowProps) {
  const translateX = useMemo(() => new Animated.Value(0), []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 10 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          );
        },
        onPanResponderGrant: () => {
          translateX.extractOffset();
        },
        onPanResponderMove: (_, gestureState) => {
          const clamped = Math.max(
            -ACTION_WIDTH,
            Math.min(ACTION_WIDTH, gestureState.dx),
          );
          translateX.setValue(clamped);
        },
        onPanResponderRelease: (_, gestureState) => {
          translateX.flattenOffset();
          const dx = gestureState.dx;

          if (dx < -SWIPE_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              onSwipeArchive(note);
            });
          } else if (dx > SWIPE_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              onSwipeDelete(note);
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [translateX, note, onSwipeArchive, onSwipeDelete],
  );

  const archiveOpacity = translateX.interpolate({
    inputRange: [-ACTION_WIDTH, -SWIPE_THRESHOLD / 2, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const deleteOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD / 2, ACTION_WIDTH],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Archive action (behind, revealed on swipe left) */}
      <Animated.View
        style={[styles.actionBehind, styles.archiveBehind, { opacity: archiveOpacity }]}
      >
        <AppText variant="caption" color={colors.white} style={styles.actionText}>
          Archive
        </AppText>
      </Animated.View>

      {/* Delete action (behind, revealed on swipe right) */}
      <Animated.View
        style={[styles.actionBehind, styles.deleteBehind, { opacity: deleteOpacity }]}
      >
        <AppText variant="caption" color={colors.white} style={styles.actionText}>
          Delete
        </AppText>
      </Animated.View>

      {/* Note row (slides) */}
      <Animated.View
        style={[styles.rowContainer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <NoteListItem note={note} onPress={onPress} onLongPress={onLongPress} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  actionBehind: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveBehind: {
    right: 0,
    backgroundColor: colors.gray500,
  },
  deleteBehind: {
    left: 0,
    backgroundColor: colors.error,
  },
  actionText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  rowContainer: {
    backgroundColor: colors.surface,
    zIndex: 1,
  },
});
