import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../contexts/ThemeContext";
import { useTodos } from "../../contexts/TodoContext";
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  RotateCcw,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const StatisticsScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const { todos, categories, getStatistics } = useTodos();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const statistics = getStatistics();

  const getProductivityScore = () => {
    const completed = statistics.completed;
    const total = statistics.total;
    if (total === 0) return 0;

    const completionRate = (completed / total) * 100;

    return Math.max(0, Math.min(100, completionRate));
  };

  const getCategoryStats = () => {
    return categories
      .map((category) => {
        const categoryTodos = todos.filter(
          (todo) => todo.category === category.id
        );
        const completed = categoryTodos.filter((todo) => todo.completed).length;
        const total = categoryTodos.length;

        return {
          id: category.id,
          name: category.name,
          color: category.color,
          total,
          completed,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      })
      .filter((stat) => stat.total > 0);
  };

  const getWeeklyData = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7);

    return weekDays.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);

      const dayTodos = todos.filter((todo) => {
        if (!todo.dueDate) return false;
        const todoDate = new Date(todo.dueDate);
        return todoDate.toDateString() === date.toDateString();
      });

      const completed = dayTodos.filter((todo) => todo.completed).length;
      const total = dayTodos.length;
      const isToday = date.toDateString() === today.toDateString();

      return {
        day,
        date,
        total,
        completed,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
        isToday,
        dayTodos,
      };
    });
  };

  const getWeeklyStats = () => {
    const weeklyData = getWeeklyData();
    const totalTasks = weeklyData.reduce((sum, day) => sum + day.total, 0);
    const completedTasks = weeklyData.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const avgCompletion =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const mostProductiveDay = weeklyData.reduce(
      (max, day) => (day.completed > max.completed ? day : max),
      weeklyData[0]
    );

    return {
      totalTasks,
      completedTasks,
      avgCompletion,
      mostProductiveDay: mostProductiveDay?.day || "N/A",
    };
  };

  const formatWeekRange = () => {
    const weeklyData = getWeeklyData();
    const startDate = weeklyData[0]?.date;
    const endDate = weeklyData[6]?.date;

    if (!startDate || !endDate) return "Current Week";

    const formatOptions = { month: "short", day: "numeric" };
    const start = startDate.toLocaleDateString("en-US", formatOptions);
    const end = endDate.toLocaleDateString("en-US", formatOptions);

    return `${start} - ${end}`;
  };

  const productivityScore = Math.round(getProductivityScore());
  const categoryStats = getCategoryStats();
  const weeklyData = getWeeklyData();
  const weeklyStats = getWeeklyStats();

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = theme.primary,
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={[styles.statTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  const CategoryBar = ({ category, maxWidth = width - 80 }) => {
    const barWidth = Math.max(20, (category.completionRate / 100) * maxWidth);

    return (
      <View style={styles.categoryBar}>
        <View style={styles.categoryBarHeader}>
          <View style={styles.categoryBarLeft}>
            <View
              style={[styles.categoryDot, { backgroundColor: category.color }]}
            />
            <Text style={[styles.categoryBarName, { color: theme.text }]}>
              {category.name}
            </Text>
          </View>
          <Text style={[styles.categoryBarRate, { color: theme.text }]}>
            {category.completionRate}%
          </Text>
        </View>
        <View
          style={[styles.categoryBarTrack, { backgroundColor: theme.border }]}
        >
          <View
            style={[
              styles.categoryBarFill,
              {
                backgroundColor: category.color,
                width: barWidth,
              },
            ]}
          />
        </View>
        <Text
          style={[styles.categoryBarSubtitle, { color: theme.textSecondary }]}
        >
          {category.completed} of {category.total} tasks completed
        </Text>
      </View>
    );
  };

  const WeeklyChart = () => {
    const maxValue = Math.max(...weeklyData.map((d) => d.total), 1);

    return (
      <View style={styles.weeklyChart}>
        {/* Week Navigation Header */}
        <View style={styles.weeklyHeader}>
          <View style={styles.weeklyTitleContainer}>
            <CalendarDays size={20} color={theme.primary} />
            <Text style={[styles.chartTitle, { color: theme.text }]}>
              Weekly Overview
            </Text>
          </View>
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: theme.surface }]}
              onPress={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            >
              <ChevronLeft size={20} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.weekRange, { color: theme.text }]}>
              {formatWeekRange()}
            </Text>
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: theme.surface }]}
              onPress={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              disabled={currentWeekOffset >= 0}
            >
              <ChevronRight
                size={20}
                color={
                  currentWeekOffset >= 0 ? theme.textSecondary : theme.text
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Stats Summary */}
        <View style={styles.weeklyStatsContainer}>
          <View style={styles.weeklyStatItem}>
            <Text style={[styles.weeklyStatValue, { color: theme.primary }]}>
              {weeklyStats.totalTasks}
            </Text>
            <Text
              style={[styles.weeklyStatLabel, { color: theme.textSecondary }]}
            >
              Total Tasks
            </Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={[styles.weeklyStatValue, { color: theme.success }]}>
              {weeklyStats.completedTasks}
            </Text>
            <Text
              style={[styles.weeklyStatLabel, { color: theme.textSecondary }]}
            >
              Completed
            </Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={[styles.weeklyStatValue, { color: theme.warning }]}>
              {weeklyStats.avgCompletion}%
            </Text>
            <Text
              style={[styles.weeklyStatLabel, { color: theme.textSecondary }]}
            >
              Avg Rate
            </Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={[styles.weeklyStatValue, { color: theme.secondary }]}>
              {weeklyStats.mostProductiveDay}
            </Text>
            <Text
              style={[styles.weeklyStatLabel, { color: theme.textSecondary }]}
            >
              Best Day
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {weeklyData.map((data, index) => {
            const barHeight = Math.max(20, (data.total / maxValue) * 100);
            const completedHeight =
              (data.completed / (data.total || 1)) * barHeight;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chartBar,
                  data.isToday && { backgroundColor: theme.primary + "10" },
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.chartBarContainer, { height: 120 }]}>
                  <View
                    style={[
                      styles.chartBarTotal,
                      {
                        height: barHeight,
                        backgroundColor: data.isToday
                          ? theme.primary + "30"
                          : theme.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.chartBarCompleted,
                        {
                          height: completedHeight,
                          backgroundColor: data.isToday
                            ? theme.primary
                            : theme.success,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text
                  style={[
                    styles.chartBarLabel,
                    {
                      color: data.isToday ? theme.primary : theme.textSecondary,
                      fontWeight: data.isToday ? "600" : "normal",
                    },
                  ]}
                >
                  {data.day}
                </Text>
                <Text
                  style={[
                    styles.chartBarValue,
                    {
                      color: data.isToday ? theme.primary : theme.text,
                      fontWeight: data.isToday ? "700" : "600",
                    },
                  ]}
                >
                  {data.total}
                </Text>
                {data.isToday && (
                  <View
                    style={[
                      styles.todayIndicator,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty State */}
        {weeklyStats.totalTasks === 0 && (
          <View style={styles.emptyWeekState}>
            <CalendarDays size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyWeekTitle, { color: theme.text }]}>
              No Tasks This Week
            </Text>
            <Text
              style={[styles.emptyWeekSubtitle, { color: theme.textSecondary }]}
            >
              {currentWeekOffset === 0
                ? "Start by adding some tasks to track your progress"
                : "No tasks were scheduled for this week"}
            </Text>
          </View>
        )}

        {/* Reset to Current Week Button */}
        {currentWeekOffset !== 0 && (
          <TouchableOpacity
            style={[styles.resetWeekButton, { backgroundColor: theme.primary }]}
            onPress={() => setCurrentWeekOffset(0)}
          >
            <RotateCcw size={16} color="#ffffff" />
            <Text style={[styles.resetWeekText, { color: "#ffffff" }]}>
              Back to Current Week
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Statistics
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Track your productivity
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={[styles.periodSelector, { backgroundColor: theme.card }]}>
          <Text style={[styles.periodTitle, { color: theme.text }]}>
            View Period
          </Text>
          <View style={styles.periodButtons}>
            {["week", "month", "all"].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor:
                      selectedPeriod === period ? theme.primary : "transparent",
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    {
                      color: selectedPeriod === period ? "#ffffff" : theme.text,
                    },
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Stats */}
        <View style={styles.mainStats}>
          <StatCard
            title="Total Tasks"
            value={statistics.total}
            subtitle="All time"
            icon={BarChart3}
            color={theme.primary}
          />
          <StatCard
            title="Completed"
            value={statistics.completed}
            subtitle={`${statistics.completionRate}% done`}
            icon={CheckCircle}
            color={theme.success}
          />
          <StatCard
            title="Pending"
            value={statistics.pending}
            subtitle="In progress"
            icon={Clock}
            color={theme.warning}
          />
          <StatCard
            title="Productivity"
            value={`${productivityScore}%`}
            subtitle="Your score"
            icon={Award}
            color={theme.secondary}
          />
        </View>

        {/* Weekly Chart */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <WeeklyChart />
        </View>

        {/* Category Stats */}
        {categoryStats.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Categories
            </Text>
            <Text
              style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
            >
              Completion rate by category
            </Text>
            <View style={styles.categoryStats}>
              {categoryStats.map((category) => (
                <CategoryBar key={category.id} category={category} />
              ))}
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Insights & Analysis
          </Text>
          <View style={styles.insights}>
            <View style={styles.insight}>
              <TrendingUp size={20} color={theme.success} />
              <Text style={[styles.insightText, { color: theme.text }]}>
                You completed {statistics.completed} tasks overall
              </Text>
            </View>
            <View style={styles.insight}>
              <Target size={20} color={theme.primary} />
              <Text style={[styles.insightText, { color: theme.text }]}>
                Your productivity score is {productivityScore}%
              </Text>
            </View>
            {currentWeekOffset === 0 && weeklyStats.totalTasks > 0 && (
              <View style={styles.insight}>
                <Calendar size={20} color={theme.secondary} />
                <Text style={[styles.insightText, { color: theme.text }]}>
                  This week: {weeklyStats.completedTasks} of{" "}
                  {weeklyStats.totalTasks} tasks completed (
                  {weeklyStats.avgCompletion}%)
                </Text>
              </View>
            )}
            {weeklyStats.mostProductiveDay !== "N/A" && (
              <View style={styles.insight}>
                <Award size={20} color={theme.warning} />
                <Text style={[styles.insightText, { color: theme.text }]}>
                  {weeklyStats.mostProductiveDay} was your most productive day
                  this week
                </Text>
              </View>
            )}
            {statistics.pending > 0 && (
              <View style={styles.insight}>
                <AlertTriangle size={20} color={theme.warning} />
                <Text style={[styles.insightText, { color: theme.text }]}>
                  {statistics.pending} tasks are still pending
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  periodSelector: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  mainStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  weeklyChart: {
    marginTop: 8,
  },
  weeklyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  weeklyTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  weekNavigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  weekRange: {
    fontSize: 14,
    fontWeight: "500",
    minWidth: 80,
    textAlign: "center",
  },
  weeklyStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  weeklyStatItem: {
    alignItems: "center",
    flex: 1,
  },
  weeklyStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
    borderRadius: 8,
    paddingVertical: 4,
    position: "relative",
  },
  chartBarContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },
  chartBarTotal: {
    borderRadius: 4,
    justifyContent: "flex-end",
    minHeight: 20,
  },
  chartBarCompleted: {
    borderRadius: 4,
  },
  chartBarLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  chartBarValue: {
    fontSize: 11,
    fontWeight: "600",
  },
  todayIndicator: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -10 }],
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  emptyWeekState: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  emptyWeekTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyWeekSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  resetWeekButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: "center",
    marginTop: 16,
  },
  resetWeekText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryStats: {
    gap: 16,
  },
  categoryBar: {
    marginBottom: 8,
  },
  categoryBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryBarName: {
    fontSize: 16,
    fontWeight: "500",
  },
  categoryBarRate: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoryBarTrack: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  categoryBarFill: {
    height: 6,
    borderRadius: 3,
  },
  categoryBarSubtitle: {
    fontSize: 12,
  },
  insights: {
    gap: 12,
  },
  insight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  insightText: {
    fontSize: 14,
    flex: 1,
  },
});

export default StatisticsScreen;
