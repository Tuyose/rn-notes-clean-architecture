import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import { AppText } from '../../../../core/design-system';
import { colors } from '../../../../core/theme';
import { NoteListItem } from './NoteListItem';
import { getSwipeIntent, getRevealOffset, clampSwipe } from '../utils/swipeIntent';
import type { Note } from '../../domain/entities';

const SCREEN_WIDTH = Dimensions.get('window').width;
const REVEAL_OFFSET = getRevealOffset(SCREEN_WIDTH);
const MAX_SWIPE = SCREEN_WIDTH * 0.75;

interface SwipeableNoteRowProps {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress?: (note: Note) => void;
  onSwipeArchive: (note: Note) => void;
  onSwipeDelete: (note: Note) => void;
}

type RevealState = 'none' | 'archive' | 'delete';

/**
 * Note row with swipe actions.
 *
 * Three-tier swipe behavior:
 * - Small swipe (<15%): snaps back
 * - Medium swipe (15-55%): reveals action, user taps to execute
 * - Fast swipe (>55% + velocity) or very far swipe (>70%): executes directly
 */
export function SwipeableNoteRow({
  note,
  onPress,
  onLongPress,
  onSwipeArchive,
  onSwipeDelete,
}: SwipeableNoteRowProps) {
  const translateX = useMemo(() => new Animated.Value(0), []);
  const rowOpacity = useMemo(() => new Animated.Value(1), []);
  const revealed = useRef<RevealState>('none');

  // Store latest props in refs for stable PanResponder callbacks
  const noteRef = useRef(note);
  const onSwipeArchiveRef = useRef(onSwipeArchive);
  const onSwipeDeleteRef = useRef(onSwipeDelete);

  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  useEffect(() => {
    onSwipeArchiveRef.current = onSwipeArchive;
  }, [onSwipeArchive]);

  useEffect(() => {
    onSwipeDeleteRef.current = onSwipeDelete;
  }, [onSwipeDelete]);

  const resetPosition = useCallback(() => {
    revealed.current = 'none';
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  }, [translateX]);

  const revealArchive = useCallback(() => {
    revealed.current = 'archive';
    Animated.spring(translateX, {
      toValue: -REVEAL_OFFSET,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [translateX]);

  const revealDelete = useCallback(() => {
    revealed.current = 'delete';
    Animated.spring(translateX, {
      toValue: REVEAL_OFFSET,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [translateX]);

  const animateOutAndExecute = useCallback(
    (action: 'archive' | 'delete') => {
      Animated.parallel([
        Animated.timing(rowOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: action === 'archive' ? -SCREEN_WIDTH : SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        rowOpacity.setValue(1);
        translateX.setValue(0);
        revealed.current = 'none';
        if (action === 'archive') {
          onSwipeArchiveRef.current(noteRef.current);
        } else {
          onSwipeDeleteRef.current(noteRef.current);
        }
      });
    },
    [translateX, rowOpacity],
  );

  // Store animation callbacks in refs
  const resetPositionRef = useRef(resetPosition);
  const revealArchiveRef = useRef(revealArchive);
  const revealDeleteRef = useRef(revealDelete);
  const animateOutAndExecuteRef = useRef(animateOutAndExecute);

  useEffect(() => {
    resetPositionRef.current = resetPosition;
  }, [resetPosition]);

  useEffect(() => {
    revealArchiveRef.current = revealArchive;
  }, [revealArchive]);

  useEffect(() => {
    revealDeleteRef.current = revealDelete;
  }, [revealDelete]);

  useEffect(() => {
    animateOutAndExecuteRef.current = animateOutAndExecute;
  }, [animateOutAndExecute]);

  // Stable PanResponder — created once, reads from refs for latest values.
  const panResponder = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- refs are read in callbacks, not during render
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
          if (revealed.current === 'archive' && gestureState.dx > 20) {
            resetPositionRef.current();
            return;
          }
          if (revealed.current === 'delete' && gestureState.dx < -20) {
            resetPositionRef.current();
            return;
          }

          const clamped = clampSwipe(gestureState.dx, MAX_SWIPE);
          translateX.setValue(clamped);
        },
        onPanResponderRelease: (_, gestureState) => {
          translateX.flattenOffset();

          const intent = getSwipeIntent(gestureState.dx, gestureState.vx, SCREEN_WIDTH);

          switch (intent) {
            case 'snap-back':
              resetPositionRef.current();
              break;
            case 'reveal-archive':
              revealArchiveRef.current();
              break;
            case 'reveal-delete':
              revealDeleteRef.current();
              break;
            case 'execute-archive':
              animateOutAndExecuteRef.current('archive');
              break;
            case 'execute-delete':
              animateOutAndExecuteRef.current('delete');
              break;
          }
        },
      }),
    // PanResponder is stable; all mutable state is in refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translateX],
  );

  const handleTapAction = useCallback(() => {
    if (revealed.current === 'archive') {
      animateOutAndExecute('archive');
    } else if (revealed.current === 'delete') {
      animateOutAndExecute('delete');
    }
  }, [animateOutAndExecute]);

  const archiveOpacity = translateX.interpolate({
    inputRange: [-REVEAL_OFFSET, -REVEAL_OFFSET * 0.3, 0],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

  const deleteOpacity = translateX.interpolate({
    inputRange: [0, REVEAL_OFFSET * 0.3, REVEAL_OFFSET],
    outputRange: [0, 0.6, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Archive action (behind, revealed on swipe left) */}
      <Animated.View
        style={[styles.actionBehind, styles.archiveBehind, { opacity: archiveOpacity }]}
      >
        <Pressable onPress={handleTapAction} style={styles.actionPressable}>
          <AppText variant="caption" color={colors.white} style={styles.actionText}>
            Archive
          </AppText>
        </Pressable>
      </Animated.View>

      {/* Delete action (behind, revealed on swipe right) */}
      <Animated.View
        style={[styles.actionBehind, styles.deleteBehind, { opacity: deleteOpacity }]}
      >
        <Pressable onPress={handleTapAction} style={styles.actionPressable}>
          <AppText variant="caption" color={colors.white} style={styles.actionText}>
            Delete
          </AppText>
        </Pressable>
      </Animated.View>

      {/* Note row (slides) */}
      <Animated.View
        style={[
          styles.rowContainer,
          { transform: [{ translateX }], opacity: rowOpacity },
        ]}
        {...panResponder.panHandlers}
      >
        <NoteListItem
          note={note}
          onPress={(n) => {
            if (revealed.current !== 'none') {
              resetPosition();
            } else {
              onPress(n);
            }
          }}
          onLongPress={onLongPress}
        />
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
    width: REVEAL_OFFSET,
    justifyContent: 'center',
  },
  archiveBehind: {
    right: 0,
    backgroundColor: colors.gray500,
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  deleteBehind: {
    left: 0,
    backgroundColor: colors.error,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  actionPressable: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  rowContainer: {
    backgroundColor: colors.surface,
    zIndex: 1,
  },
});
