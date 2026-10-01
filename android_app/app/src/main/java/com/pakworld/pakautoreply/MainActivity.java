package com.pakworld.pakautoreply;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;
import com.pakworld.pakautoreply.util.AIPreferences;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SwitchCompat switchMaster = findViewById(R.id.switch_master);
        switchMaster.setChecked(AIPreferences.isAIEnabled(this));
        switchMaster.setOnCheckedChangeListener((btn, isChecked) -> {
            AIPreferences.setAIEnabled(this, isChecked);
        });

        LinearLayout cardAISettings = findViewById(R.id.card_ai_settings);
        Button btnOpenAI = findViewById(R.id.btn_open_ai_settings);

        cardAISettings.setOnClickListener(v -> openAISettings());
        btnOpenAI.setOnClickListener(v -> openAISettings());

        LinearLayout cardTestReply = findViewById(R.id.card_test_reply);
        cardTestReply.setOnClickListener(v -> {
            startActivity(new Intent(MainActivity.this, TestReplyActivity.class));
        });
    }

    private void openAISettings() {
        startActivity(new Intent(MainActivity.this, AISettingsActivity.class));
    }
}
