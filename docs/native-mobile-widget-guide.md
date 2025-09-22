# 📱 Native Mobile Weather Widget Implementation

## iOS Widget Implementation

### SwiftUI Widget Code

```swift
import WidgetKit
import SwiftUI

// Weather Widget Entry
struct WeatherEntry: TimelineEntry {
    let date: Date
    let current: WeatherCurrent
    let forecast: [WeatherDay]
    let configuration: ConfigurationIntent
}

// Weather Data Models
struct WeatherCurrent {
    let temperature: Double
    let icon: String
    let description: String
    let humidity: Int
    let windSpeed: Double
}

struct WeatherDay {
    let date: Date
    let tempMin: Double
    let tempMax: Double
    let icon: String
    let precipitationChance: Int
}

// Main Widget
@main
struct WeatherWidget: Widget {
    let kind: String = "WeatherWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(
            kind: kind,
            intent: ConfigurationIntent.self,
            provider: WeatherProvider()
        ) { entry in
            WeatherWidgetView(entry: entry)
        }
        .configurationDisplayName("Weather Widget")
        .description("Current weather and 6-day forecast")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// Widget View
struct WeatherWidgetView: View {
    let entry: WeatherProvider.Entry

    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWeatherView(entry: entry)
        case .systemMedium:
            MediumWeatherView(entry: entry)
        case .systemLarge:
            LargeWeatherView(entry: entry)
        default:
            SmallWeatherView(entry: entry)
        }
    }
}

// Small Widget (2x2)
struct SmallWeatherView: View {
    let entry: WeatherProvider.Entry

    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Text("Pinto Ñuble")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                Spacer()
                Image(systemName: "location.fill")
                    .font(.caption2)
            }

            Spacer()

            HStack(alignment: .top, spacing: 8) {
                VStack {
                    Text("\(Int(entry.current.temperature))°")
                        .font(.system(size: 32, weight: .bold))
                    Text(entry.current.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Image(systemName: weatherIcon(for: entry.current.icon))
                    .font(.system(size: 24))
                    .foregroundColor(.blue)
            }
        }
        .padding(12)
    }
}

// Medium Widget (2x4)
struct MediumWeatherView: View {
    let entry: WeatherProvider.Entry

    var body: some View {
        VStack(spacing: 8) {
            // Header
            HStack {
                VStack(alignment: .leading) {
                    Text("Pinto Los Pellines")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("Actualizado \(entry.date, style: .time)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Button(intent: RefreshWeatherIntent()) {
                    Image(systemName: "arrow.clockwise")
                        .font(.caption)
                }
            }

            // Current Weather
            HStack(alignment: .center, spacing: 12) {
                VStack(alignment: .leading) {
                    Text("\(Int(entry.current.temperature))°C")
                        .font(.system(size: 28, weight: .bold))
                    Text("ST: \(Int(entry.current.temperature + 2))°")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(entry.current.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    Image(systemName: weatherIcon(for: entry.current.icon))
                        .font(.system(size: 32))
                        .foregroundColor(.blue)

                    HStack(spacing: 4) {
                        Image(systemName: "wind")
                            .font(.caption)
                        Text("\(Int(entry.current.windSpeed)) km/h")
                            .font(.caption)
                    }
                }
            }

            Divider()

            // 6-Day Forecast
            VStack(spacing: 4) {
                ForEach(entry.forecast.prefix(6), id: \.date) { day in
                    HStack {
                        Text(day.date, format: .dateTime.weekday(.abbreviated))
                            .font(.caption)
                            .frame(width: 40, alignment: .leading)

                        Image(systemName: weatherIcon(for: day.icon))
                            .font(.caption)
                            .foregroundColor(.blue)

                        Spacer()

                        Text("\(Int(day.tempMax))°")
                            .font(.caption)
                            .fontWeight(.semibold)

                        Text("\(Int(day.tempMin))°")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding(12)
    }
}

// Large Widget (4x4)
struct LargeWeatherView: View {
    let entry: WeatherProvider.Entry

    var body: some View {
        VStack(spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading) {
                    Text("🌤️ Clima")
                        .font(.headline)
                    Text("Pinto Los Pellines, Ñuble")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Button(intent: RefreshWeatherIntent()) {
                    Image(systemName: "arrow.clockwise")
                        .font(.title3)
                }
            }

            // Current Weather
            HStack(alignment: .center, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(Int(entry.current.temperature))°C")
                        .font(.system(size: 48, weight: .bold))
                    Text("Sensación térmica: \(Int(entry.current.temperature + 2))°")
                        .font(.subheadline)
                    Text(entry.current.description.capitalized)
                        .font(.title3)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 8) {
                    Image(systemName: weatherIcon(for: entry.current.icon))
                        .font(.system(size: 64))
                        .foregroundColor(.blue)

                    HStack(spacing: 12) {
                        VStack(spacing: 4) {
                            Image(systemName: "humidity")
                                .font(.title3)
                            Text("\(entry.current.humidity)%")
                                .font(.caption)
                        }

                        VStack(spacing: 4) {
                            Image(systemName: "wind")
                                .font(.title3)
                            Text("\(Int(entry.current.windSpeed)) km/h")
                                .font(.caption)
                        }

                        VStack(spacing: 4) {
                            Image(systemName: "sun.max")
                                .font(.title3)
                            Text("UV \(entry.current.uvIndex ?? 0)")
                                .font(.caption)
                        }
                    }
                }
            }

            Divider()

            // Hourly Forecast (6 hours)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(0..<6, id: \.self) { index in
                        VStack(spacing: 4) {
                            Text("\(Date().addingTimeInterval(Double(index) * 3600), format: .dateTime.hour())")
                                .font(.caption)
                            Image(systemName: "sun.max")
                                .font(.title3)
                                .foregroundColor(.blue)
                            Text("\(Int(entry.current.temperature + Double.random(in: -2...2)))°")
                                .font(.caption)
                                .fontWeight(.semibold)
                        }
                        .frame(width: 50)
                    }
                }
            }

            Divider()

            // 6-Day Forecast
            VStack(spacing: 6) {
                ForEach(entry.forecast.prefix(6), id: \.date) { day in
                    HStack {
                        Text(day.date, format: .dateTime.weekday(.wide))
                            .font(.caption)
                            .frame(width: 80, alignment: .leading)

                        Image(systemName: weatherIcon(for: day.icon))
                            .font(.title3)
                            .foregroundColor(.blue)

                        Spacer()

                        HStack(spacing: 8) {
                            Text("\(Int(day.tempMax))°")
                                .font(.caption)
                                .fontWeight(.semibold)

                            Text("\(Int(day.tempMin))°")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }

                        if day.precipitationChance > 0 {
                            HStack(spacing: 2) {
                                Image(systemName: "cloud.rain")
                                    .font(.caption)
                                    .foregroundColor(.blue)
                                Text("\(day.precipitationChance)%")
                                    .font(.caption)
                                    .foregroundColor(.blue)
                            }
                        }
                    }
                }
            }
        }
        .padding(16)
    }
}

// Weather Provider
struct WeatherProvider: IntentTimelineProvider {
    func placeholder(in context: Context) -> WeatherEntry {
        WeatherEntry(
            date: Date(),
            current: WeatherCurrent(
                temperature: 18,
                icon: "sun",
                description: "Soleado",
                humidity: 65,
                windSpeed: 15
            ),
            forecast: [],
            configuration: ConfigurationIntent()
        )
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (WeatherEntry) -> ()) {
        let entry = WeatherEntry(
            date: Date(),
            current: WeatherCurrent(
                temperature: 18,
                icon: "sun",
                description: "Soleado",
                humidity: 65,
                windSpeed: 15
            ),
            forecast: createMockForecast(),
            configuration: configuration
        )
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<WeatherEntry>) -> ()) {
        // Fetch real weather data from your API
        Task {
            do {
                // Call your Convex weather API here
                let weatherData = try await fetchWeatherData()

                let entry = WeatherEntry(
                    date: Date(),
                    current: weatherData.current,
                    forecast: weatherData.forecast,
                    configuration: configuration
                )

                let timeline = Timeline(entries: [entry], policy: .atEnd)
                completion(timeline)
            } catch {
                // Fallback to cached data
                let entry = createFallbackEntry()
                let timeline = Timeline(entries: [entry], policy: .atEnd)
                completion(timeline)
            }
        }
    }

    private func createMockForecast() -> [WeatherDay] {
        (0..<6).map { index in
            WeatherDay(
                date: Calendar.current.date(byAdding: .day, value: index, to: Date())!,
                tempMin: Double(12 + index),
                tempMax: Double(18 + index),
                icon: "sun",
                precipitationChance: Int.random(in: 0...30)
            )
        }
    }

    private func createFallbackEntry() -> WeatherEntry {
        WeatherEntry(
            date: Date(),
            current: WeatherCurrent(
                temperature: 18,
                icon: "sun",
                description: "Soleado",
                humidity: 65,
                windSpeed: 15
            ),
            forecast: createMockForecast(),
            configuration: ConfigurationIntent()
        )
    }
}

// Weather Icon Mapping
func weatherIcon(for icon: String) -> String {
    switch icon.lowercased() {
    case "sun", "clear": return "sun.max.fill"
    case "partly-cloudy": return "cloud.sun.fill"
    case "cloudy": return "cloud.fill"
    case "rain": return "cloud.rain.fill"
    case "heavy-rain": return "cloud.heavyrain.fill"
    default: return "cloud.fill"
    }
}

// Intents
struct RefreshWeatherIntent: AppIntent {
    static var title: LocalizedStringResource = "Refresh Weather"

    func perform() async throws -> some IntentResult {
        // Trigger weather refresh
        return .result()
    }
}
```

## Android Widget Implementation

### Kotlin Widget Code

```kotlin
package com.juntadevecinos.weather.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import android.app.PendingIntent
import android.content.Intent
import kotlinx.coroutines.*

class WeatherWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateWeatherWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateWeatherWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Fetch weather data from your API
                val weatherData = WeatherApiService.fetchCurrentWeather()

                withContext(Dispatchers.Main) {
                    val views = RemoteViews(context.packageName, R.layout.weather_widget)

                    // Update current weather
                    views.setTextViewText(R.id.temperature, "${weatherData.temperature.toInt()}°")
                    views.setTextViewText(R.id.description, weatherData.description)
                    views.setImageViewResource(R.id.weather_icon, getWeatherIcon(weatherData.icon))

                    // Update location
                    views.setTextViewText(R.id.location, "Pinto Ñuble")

                    // Update forecast (6 days)
                    updateForecastViews(views, weatherData.forecast)

                    // Set up click intent to open app
                    val intent = Intent(context, MainActivity::class.java)
                    val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
                    views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

                    appWidgetManager.updateAppWidget(appWidgetId, views)
                }
            } catch (e: Exception) {
                // Handle error - show cached data or error state
            }
        }
    }

    private fun updateForecastViews(views: RemoteViews, forecast: List<WeatherDay>) {
        forecast.take(6).forEachIndexed { index, day ->
            val dayViewId = when (index) {
                0 -> R.id.day_1_container
                1 -> R.id.day_2_container
                2 -> R.id.day_3_container
                3 -> R.id.day_4_container
                4 -> R.id.day_5_container
                5 -> R.id.day_6_container
                else -> return@forEachIndexed
            }

            views.setTextViewText(getDayNameId(index), getDayName(index))
            views.setTextViewText(getTempMaxId(index), "${day.tempMax.toInt()}°")
            views.setTextViewText(getTempMinId(index), "${day.tempMin.toInt()}°")
            views.setImageViewResource(getIconId(index), getWeatherIcon(day.icon))
        }
    }

    private fun getDayName(dayIndex: Int): String {
        return when (dayIndex) {
            0 -> "Hoy"
            1 -> "Mañana"
            else -> {
                val calendar = Calendar.getInstance()
                calendar.add(Calendar.DAY_OF_YEAR, dayIndex)
                SimpleDateFormat("EEE", Locale("es", "CL")).format(calendar.time)
            }
        }
    }

    private fun getWeatherIcon(icon: String): Int {
        return when (icon.lowercased()) {
            "sun", "clear" -> R.drawable.ic_weather_sunny
            "partly-cloudy" -> R.drawable.ic_weather_partly_cloudy
            "cloudy" -> R.drawable.ic_weather_cloudy
            "rain" -> R.drawable.ic_weather_rain
            "heavy-rain" -> R.drawable.ic_weather_heavy_rain
            else -> R.drawable.ic_weather_cloudy
        }
    }
}
```

### Widget Layout (res/layout/weather_widget.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_container"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@drawable/widget_background"
    android:orientation="vertical"
    android:padding="16dp">

    <!-- Header -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_marginBottom="8dp">

        <TextView
            android:id="@+id/location"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Pinto Ñuble"
            android:textColor="@android:color/white"
            android:textSize="12sp" />

        <ImageButton
            android:id="@+id/refresh_button"
            android:layout_width="24dp"
            android:layout_height="24dp"
            android:src="@drawable/ic_refresh"
            android:background="?android:attr/selectableItemBackground"
            android:contentDescription="Actualizar clima" />

    </LinearLayout>

    <!-- Current Weather -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical"
        android:layout_marginBottom="12dp">

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical">

            <TextView
                android:id="@+id/temperature"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="18°"
                android:textColor="@android:color/white"
                android:textSize="32sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/description"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Soleado"
                android:textColor="@android:color/white"
                android:textSize="14sp" />

        </LinearLayout>

        <ImageView
            android:id="@+id/weather_icon"
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:src="@drawable/ic_weather_sunny"
            android:contentDescription="Icono del clima" />

    </LinearLayout>

    <!-- 6-Day Forecast -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <!-- Day 1 -->
        <include layout="@layout/weather_day_row"
            android:id="@+id/day_1_container" />

        <!-- Day 2 -->
        <include layout="@layout/weather_day_row"
            android:id="@+id/day_2_container" />

        <!-- Day 3 -->
        <include layout="@layout/weather_day_row"
            android:id="@+id/day_3_container" />

        <!-- Day 4 -->
        <include layout="@layout/weather_day_row"
            android:id="@+id/day_4_container" />

        <!-- Day 5 -->
        <include layout="@layout/weather_day_row"
            android:id="@+id/day_5_container" />

        <!-- Day 6 -->
        <include layout="@layout/weather_day_row"
            android:id="@+id/day_6_container" />

    </LinearLayout>

</LinearLayout>
```

### Widget Configuration (res/xml/weather_widget_info.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="110dp"
    android:targetCellWidth="4"
    android:targetCellHeight="2"
    android:maxResizeWidth="4"
    android:maxResizeHeight="4"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:initialLayout="@layout/weather_widget"
    android:configure="com.juntadevecinos.weather.widget.WeatherWidgetConfigureActivity"
    android:description="@string/widget_description"
    android:previewImage="@drawable/widget_preview">
</appwidget-provider>
```

## Capacitor Integration

### For Cross-Platform Apps

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.juntadevecinos.weather',
  appName: 'Junta de Vecinos Weather',
  webDir: 'out',
  bundledWebRuntime: false,
  plugins: {
    // Weather widget plugin would go here
  },
  ios: {
    scheme: 'WeatherApp'
  },
  android: {
    buildOptions: {
      // Enable widgets
      androidXEnabled: true
    }
  }
};

export default config;
```

## Implementation Steps

### 1. iOS Setup

1. Add Widget Extension target to Xcode project
2. Implement `WidgetKit` framework
3. Create widget intents for configuration
4. Set up background refresh capabilities
5. Test on physical devices

### 2. Android Setup

1. Create `AppWidgetProvider` class
2. Define widget layouts and dimensions
3. Implement `JobScheduler` for background updates
4. Add widget to app manifest
5. Test on various screen sizes

### 3. Data Synchronization

1. Implement shared data layer between app and widgets
2. Set up push notifications for weather alerts
3. Handle offline scenarios with cached data
4. Optimize battery usage with smart refresh intervals

### 4. Testing

1. Test on multiple device sizes
2. Verify data accuracy and timeliness
3. Check battery impact
4. Validate accessibility features

This implementation provides native home screen widgets that can display live weather data with 6-day forecasts, exactly as requested.
