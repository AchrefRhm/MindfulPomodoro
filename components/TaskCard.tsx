import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Play, Trash2, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStartPomodoro: (taskId: string) => void;
}

export function TaskCard({ task, onToggle, onDelete, onStartPomodoro }: TaskCardProps) {
  const { currentTheme, isDark } = useTheme();
  const styles = createStyles(currentTheme, isDark);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FFA500';
      case 'low': return '#4CAF50';
      default: return currentTheme.textSecondary;
    }
  };

  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.completed && { backgroundColor: currentTheme.accent },
        ]}
        onPress={() => onToggle(task.id)}
      >
        {task.completed && <Check size={16} color="#FFFFFF" />}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
        
        <View style={styles.metadata}>
          <View style={styles.pomodoroProgress}>
            <Clock size={14} color={currentTheme.textSecondary} />
            <Text style={styles.pomodoroText}>
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </Text>
          </View>
          
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {!task.completed && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: currentTheme.primary }]}
            onPress={() => onStartPomodoro(task.id)}
          >
            <Play size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(task.id)}
        >
          <Trash2 size={16} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  completedCard: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    fontFamily: 'Inter-Bold',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: theme.textSecondary,
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pomodoroProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pomodoroText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontFamily: 'Inter-Bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
});