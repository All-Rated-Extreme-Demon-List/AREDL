<script setup>
import {ref} from "vue";
import LevelView from "@/components/list/LevelView.vue";
import ListStaff from "@/components/list/ListStaff.vue";
import ListView from "@/components/list/ListView.vue";
import {ColorPicker} from "vue-accessible-color-picker";

const selected_level = ref()

const mobile_list_expanded = ref(true)

</script>

<template>
  <div class="page">

    <div class="list-tab tab" :class="!mobile_list_expanded && 'hidden-mobile'">
      <ListView @select="(selected) => {selected_level = selected; if (mobile_list_expanded) mobile_list_expanded = selected.init}"></ListView>
    </div>
    <div class="level-tab tab" :class="mobile_list_expanded && 'hidden-mobile'">
      <LevelView :selected_level="selected_level" class="level-view"></LevelView>
    </div>
    <div class="info-tab tab">
      <div class="info-view">
        <ListStaff></ListStaff>
        <div class="info-text">
          <h3> How to Submit Records</h3>
          <p>
            Join our <a href="https://discord.gg/aredl">discord server</a>, and use /record submit. You can find more information about submitting records in the #record-submissions channel
          </p>
          <h3>Submission Requirements</h3>
          <p>
            When submitting your record, please ensure that it complies with the following guidelines:
          </p>
          <p>
            1. Your record must have clicks, COMPLETELY audible throughout the whole level. Not audible sometimes, at the end, or the beginning the whole level. "But what if there was a mistake with the-" We apologize, but we have to be able to hear full audible clicks throughout your video. (Taps, if you're playing on mobile. Same rules apply.)
          </p>
          <p>
            2. Your record must have a cheat indicator on the end screen. If you're playing vanilla GD, or you have a mod menu that does not use a cheat indicator, this is not required. However, you have to put that in your notes, we are not responsible for figuring out which mod menu you used, or if you're playing on vanilla. </p>
          <p>
            3. If you are using an LDM or a bugfix copy of a level, it must either be approved by list staff, or not make a difference without a doubt. Use your best judgement here, if you are uncertain whether or not your bugfix copy/LDM of a level can be accepted, file a support ticket with the level ID. However, if you're absolutely certain that your copy is fine, you don't need to get it approved in order to get your record accepted. If you're unaware of what an "acceptable" copy would be, go ahead and file a support ticket. (We deny copies that either change gameplay of the level, or remove so much detail that it makes the level easier.) </p>
          <p>
            4. Your record must have an uncut end screen. If your video ends before we see the end screen, and your stats are not visible, it is not an acceptable record.
          </p>
          <p>
            5. If your record is in the top 400, you must have raw footage, with split audio tracks, submitted along with your original record in a downloadable format such as Google Drive. If it was streamed, a VOD on Twitch or Youtube with chat enabled is also allowed. However, if you have the record on your Pointercrate profile, you may submit that in the additional info instead, and we will accept your record. However, please note that we will not accept records that used Physics Bypass while it was allowed on pointercrate, since Physics Bypass was not ever allowed on the AREDL.<br/>
            If you need help setting up split audio tracks, try following one of these guides:<br/>
            <a href="https://obsproject.com/kb/multiple-audio-track-recording-guide">OBS</a><br/>
            <a href="https://support.medal.tv/support/solutions/articles/48001220541-multi-track-recording">Medal</a>
            </p>
          <p>
            6. This should be obvious, but your record may not be completed with any disallowed mods. This information (of what we allow and don't allow) can be found on our website. This rule also applies to having a red/blue cheat indicator, obvious hacked completions, and bots.
          </p>
          <p>
            7. Globed 2P Completions will be allowed on AREDL, however, your video needs to have both POVs, or you need to submit your friend's video in the notes. Globed deathlink is allowed for levels that do not work with the built in Globed 2P mode, but these completions needs to be on an official AREDL Globed copy, which can be found on the "AREDLofficial" Geometry Dash account.</p>
          <h3> Why was my record denied?</h3>
          <p>
            If your record was denied, please check the following:
          </p>
          <p>
            Does the video meet the requirements? (Above)
          </p>
          <p>
            Is the level placed on the list? (#pending-changes)
          </p>
          <p>
            Was the submission command filled out correctly?
          </p>
          <p>
            Was the record submitted with several links?
          </p>
          <p>
            Note: You will be pinged in #records with the reason why your record was denied. If you are still unsure of why it was denied, or if the record was wrongfully denied, please make a post in #support or DM any list staff on Discord
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.page {
  overflow: hidden;
  height: 100%;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: minmax(16rem, 1fr) minmax(16rem, 2fr) minmax( 16em, 1fr );
}

.info-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-view h3 {
  color: var(--color-on-primary);
  font-size: 23px;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-paragraph {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-view p {
  color: var(--color-on-primary);
  font-size: 17px;
  line-height: 28px;
}

.tab {
  height: 100%;
  display: block;
  overflow-y: auto;
}

.info-tab {
  padding-top: 1.5rem;
  padding-right: 2rem;
  padding-left: 2rem;
}

.mobile-expand {
  display: none;
}

@media (max-width: 880px) {
  /* .hidden-mobile {
    display: none;
  } */

  /* .mobile-expand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 100%;
    background: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 15%);
    border: none;
  } */

  .page {
    /* overflow: hidden; */
    height: 100%;
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
  }

  .info-tab {
    width: 67%;
    flex-shrink: 0;
    scroll-snap-align: center;
  }

  .level-tab {
    width: 67%;
    flex-shrink: 0;
  }

  .list-tab {
    width: 33%;
    flex-shrink: 0;
    scroll-snap-align: center;
  }
}

@media (max-width: 600px) {
  .page {
    /* overflow: hidden; */
    height: 100%;
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
  }

  .info-tab {
    width: 100%;
    flex-shrink: 0;
    scroll-snap-align: center;
  }

  .level-tab {
    width: 100%;
    flex-shrink: 0;
    scroll-snap-align: center;
  }

  .list-tab {
    width: 100%;
    flex-shrink: 0;
    scroll-snap-align: center;
  }
}

</style>
